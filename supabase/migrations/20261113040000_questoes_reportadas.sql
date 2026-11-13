-- Aluno reporta problema numa questão (gabarito, texto, desatualizada).
-- Vai como evento anônimo comum: mesmas regras de privacidade, teto e cota.
-- O painel do admin passa a listar as questões mais reportadas.
alter table public.eventos drop constraint if exists eventos_nome_check;
alter table public.eventos add constraint eventos_nome_check check (nome in (
  'abriu_app', 'abriu_prova', 'abriu_ficha', 'pratica_fim', 'simulado_inicio', 'simulado_fim',
  'simulado_abandonado', 'revisao_fim', 'abriu_guia', 'abriu_servico', 'tocou_video', 'login', 'instalou_pwa',
  'questao_reportada'
));
create index if not exists eventos_reportada on public.eventos ((dados->>'questao'))
  where nome = 'questao_reportada';

create or replace function privado.painel_resumo_interno(p_dias integer default 7)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  desde timestamptz;
begin
  if not exists (select 1 from public.admins where user_id = (select auth.uid())) then
    return null;
  end if;
  desde := now() - make_interval(days => least(greatest(coalesce(p_dias, 7), 1), 90));
  return jsonb_build_object(
    'dias', least(greatest(coalesce(p_dias, 7), 1), 90),
    'sessoes', (select count(distinct sessao) from public.eventos where criado_em >= desde),
    'contas', (select count(*) from public.progresso),
    'contas_ativas', (select count(*) from public.progresso where atualizado_em >= desde),
    'eventos', coalesce((select jsonb_object_agg(nome, n) from (
        select nome, count(*) as n from public.eventos where criado_em >= desde group by nome) t), '{}'::jsonb),
    'provas', coalesce((select jsonb_object_agg(exam, n) from (
        select dados->>'exam' as exam, count(*) as n from public.eventos
        where criado_em >= desde and nome = 'abriu_prova' and dados ? 'exam' group by 1) t), '{}'::jsonb),
    'simulados', coalesce((select jsonb_object_agg(exam, jsonb_build_object('n', n, 'media', media, 'aprovados', aprov)) from (
        select dados->>'exam' as exam, count(*) as n, round(avg((dados->>'score')::numeric)) as media,
               count(*) filter (where (dados->>'pass')::boolean) as aprov
        from public.eventos where criado_em >= desde and nome = 'simulado_fim' and dados ? 'exam' group by 1) t), '{}'::jsonb),
    'servicos_top', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'n', n)) from (
        select dados->>'servico' as id, count(*) as n from public.eventos
        where criado_em >= desde and nome = 'abriu_servico' group by 1 order by 2 desc limit 10) t), '[]'::jsonb),
    -- distinct sessao: a mesma pessoa reportando várias vezes conta uma
    'reportadas', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'motivo', motivo, 'n', n)) from (
        select dados->>'questao' as id, dados->>'motivo' as motivo, count(distinct sessao) as n
        from public.eventos where criado_em >= desde and nome = 'questao_reportada' and dados ? 'questao'
        group by 1, 2 order by 3 desc limit 20) t), '[]'::jsonb),
    'erros', coalesce((select jsonb_agg(jsonb_build_object('mensagem', mensagem, 'n', n, 'ultimo', ultimo, 'versao', versao)) from (
        select mensagem, count(*) as n, max(criado_em) as ultimo, max(versao_app) as versao
        from public.erros where criado_em >= desde group by mensagem order by 2 desc limit 15) t), '[]'::jsonb)
  );
end;
$$;
revoke all on function privado.painel_resumo_interno(integer) from public, anon;
grant execute on function privado.painel_resumo_interno(integer) to authenticated;
