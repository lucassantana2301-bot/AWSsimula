-- Cota diária da telemetria (revisão de segurança).
-- O teto por minuto ainda permitia ~4 milhões de eventos por dia com a
-- chave pública, o bastante para lotar o banco grátis (500 MB). Um contador
-- por dia e por tabela custa um upsert por insert e fecha essa porta.
-- Pior caso agora: (5.000 eventos + 1.000 erros) por dia x 60 dias.
create table public.telemetria_cota (
  dia date not null,
  tabela text not null check (tabela in ('erros', 'eventos')),
  n integer not null default 0,
  primary key (dia, tabela)
);
alter table public.telemetria_cota enable row level security;
-- sem policy: ninguém lê nem escreve pela API; só o trigger (definer)

create or replace function public.telemetria_teto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recentes integer;
  hoje integer;
  teto_minuto constant integer := case tg_table_name when 'erros' then 120 else 600 end;
  teto_dia constant integer := case tg_table_name when 'erros' then 1000 else 5000 end;
begin
  insert into public.telemetria_cota as c (dia, tabela, n)
  values (current_date, tg_table_name, 1)
  on conflict (dia, tabela) do update set n = c.n + 1
  returning c.n into hoje;
  if hoje > teto_dia then
    raise exception 'telemetria acima da cota diária' using errcode = '54000';
  end if;
  if tg_table_name = 'erros' then
    select count(*) into recentes from public.erros where criado_em > now() - interval '1 minute';
  else
    select count(*) into recentes from public.eventos where criado_em > now() - interval '1 minute';
  end if;
  if recentes >= teto_minuto then
    raise exception 'telemetria acima do teto' using errcode = '54000';
  end if;
  new.criado_em := now();
  return new;
end;
$$;
revoke all on function public.telemetria_teto() from public, anon, authenticated;

-- retenção menor e limpeza da cota antiga
select cron.unschedule('limpa-telemetria');
select cron.schedule(
  'limpa-telemetria',
  '17 4 * * *',
  $$delete from public.erros where criado_em < now() - interval '60 days';
    delete from public.eventos where criado_em < now() - interval '60 days';
    delete from public.telemetria_cota where dia < current_date - 7;$$
);
