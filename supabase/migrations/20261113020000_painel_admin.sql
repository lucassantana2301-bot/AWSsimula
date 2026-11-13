-- Painel de uso e erros, visível só para quem está em `admins`.
-- Ninguém se adiciona pela API: a tabela não tem policy de escrita.
-- Para virar admin (rodar no SQL editor do Supabase, com o seu id de usuário):
--   insert into public.admins (user_id) values ('<uuid>');
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admin ve a propria linha" on public.admins
  for select to authenticated using ((select auth.uid()) = user_id);

-- A parte com privilégio fica fora do schema exposto pela API (linter 0029).
create schema if not exists privado;
revoke all on schema privado from public, anon;
grant usage on schema privado to authenticated;

create function privado.painel_resumo_interno(p_dias integer default 7)
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
    'erros', coalesce((select jsonb_agg(jsonb_build_object('mensagem', mensagem, 'n', n, 'ultimo', ultimo, 'versao', versao)) from (
        select mensagem, count(*) as n, max(criado_em) as ultimo, max(versao_app) as versao
        from public.erros where criado_em >= desde group by mensagem order by 2 desc limit 15) t), '[]'::jsonb)
  );
end;
$$;
revoke all on function privado.painel_resumo_interno(integer) from public, anon;
grant execute on function privado.painel_resumo_interno(integer) to authenticated;

-- Fachada pública sem privilégio: só repassa. Quem não é admin recebe null.
create function public.painel_resumo(p_dias integer default 7)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$ select privado.painel_resumo_interno(p_dias) $$;
revoke all on function public.painel_resumo(integer) from public, anon;
grant execute on function public.painel_resumo(integer) to authenticated;
