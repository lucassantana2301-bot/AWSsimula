-- Web Vitals de campo (LCP, INP, CLS) como evento anônimo "web_vitais" (auditoria, item 39).
-- Mesmas regras dos outros eventos: só insert anônimo, teto por sessão e cota diária.
-- O painel do admin ganha o p75 de cada métrica (o número que o Google usa) e a parcela "bom".
alter table public.eventos drop constraint if exists eventos_nome_check;
alter table public.eventos add constraint eventos_nome_check check (nome in (
  'abriu_app', 'abriu_prova', 'abriu_ficha', 'pratica_fim', 'simulado_inicio', 'simulado_fim',
  'simulado_abandonado', 'revisao_fim', 'abriu_guia', 'abriu_servico', 'tocou_video', 'login', 'instalou_pwa',
  'questao_reportada', 'web_vitais'
));

create or replace function privado.painel_vitais_interno(p_dias integer default 7)
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
  return coalesce((
    select jsonb_object_agg(m, jsonb_build_object('p75', p75, 'bom', bom, 'n', n))
    from (
      select m,
             percentile_cont(0.75) within group (order by v) as p75,
             round(100.0 * count(*) filter (where f = 'bom') / nullif(count(*), 0)) as bom,
             count(*) as n
      from (
        select x.m, (e.dados->>x.m)::numeric as v, e.dados->>(x.m || '_faixa') as f
        from public.eventos e
        cross join (values ('lcp'), ('inp'), ('cls')) as x(m)
        where e.nome = 'web_vitais' and e.criado_em >= desde
          and jsonb_typeof(e.dados->x.m) = 'number'
      ) amostras
      group by m
    ) t), '{}'::jsonb);
end;
$$;
revoke all on function privado.painel_vitais_interno(integer) from public, anon;
grant execute on function privado.painel_vitais_interno(integer) to authenticated;

create or replace function public.painel_vitais(p_dias integer default 7)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$ select privado.painel_vitais_interno(p_dias) $$;
revoke all on function public.painel_vitais(integer) from public, anon;
grant execute on function public.painel_vitais(integer) to authenticated;
