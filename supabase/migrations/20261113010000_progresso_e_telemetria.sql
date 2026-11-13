-- CloudQuest: progresso por conta e telemetria anônima (ADR-0002).
-- Segurança: RLS em tudo. Progresso só do próprio usuário; telemetria só
-- aceita insert anônimo e ninguém lê pela API pública.

-- ---------- progresso ----------
create table public.progresso (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  estado jsonb not null,
  versao integer not null default 1 check (versao > 0),
  atualizado_em timestamptz not null default now(),
  constraint estado_eh_objeto check (jsonb_typeof(estado) = 'object'),
  constraint estado_ate_512kb check (pg_column_size(estado) <= 524288)
);
comment on table public.progresso is 'Uma linha por usuário com o estado do app (S). Versão para escrita otimista.';

alter table public.progresso enable row level security;

create policy "le o proprio progresso" on public.progresso
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "cria o proprio progresso" on public.progresso
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "atualiza o proprio progresso" on public.progresso
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "apaga o proprio progresso" on public.progresso
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Escrita otimista: só grava se a versão no banco for a que o cliente leu.
-- Devolve a nova versão, ou null em conflito (o cliente relê, mescla e tenta de novo).
create function public.salvar_progresso(p_estado jsonb, p_versao integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  nova integer;
begin
  if (select auth.uid()) is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;
  if p_versao = 0 then
    insert into public.progresso (user_id, estado, versao)
    values ((select auth.uid()), p_estado, 1)
    on conflict (user_id) do nothing
    returning versao into nova;
  else
    update public.progresso
       set estado = p_estado, versao = versao + 1, atualizado_em = now()
     where user_id = (select auth.uid()) and versao = p_versao
    returning versao into nova;
  end if;
  return nova;
end;
$$;
revoke all on function public.salvar_progresso(jsonb, integer) from public, anon;
grant execute on function public.salvar_progresso(jsonb, integer) to authenticated;

-- ---------- telemetria anônima ----------
create table public.erros (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  sessao uuid not null,
  versao_app text not null check (char_length(versao_app) <= 40),
  tela text check (char_length(tela) <= 40),
  mensagem text not null check (char_length(mensagem) between 1 and 500),
  origem text check (char_length(origem) <= 300),
  pilha text check (char_length(pilha) <= 4000),
  navegador text check (char_length(navegador) <= 60)
);
create index erros_criado_em on public.erros (criado_em desc);

create table public.eventos (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  sessao uuid not null,
  versao_app text not null check (char_length(versao_app) <= 40),
  nome text not null check (nome in (
    'abriu_app', 'abriu_prova', 'abriu_ficha', 'pratica_fim', 'simulado_inicio', 'simulado_fim',
    'simulado_abandonado', 'revisao_fim', 'abriu_guia', 'abriu_servico', 'tocou_video', 'login', 'instalou_pwa'
  )),
  dados jsonb not null default '{}' check (jsonb_typeof(dados) = 'object' and pg_column_size(dados) <= 2048)
);
create index eventos_criado_em on public.eventos (criado_em desc);
create index eventos_nome_criado on public.eventos (nome, criado_em desc);

alter table public.erros enable row level security;
alter table public.eventos enable row level security;

-- só inserir; sem policy de select = ninguém lê pela API (leitura pelo painel)
create policy "registra erro anonimo" on public.erros
  for insert to anon, authenticated with check (criado_em >= now() - interval '1 minute');
create policy "registra evento anonimo" on public.eventos
  for insert to anon, authenticated with check (criado_em >= now() - interval '1 minute');

-- Teto global contra abuso: com a chave pública qualquer um pode inserir.
-- Acima do teto por minuto o insert é recusado (o app ignora a falha).
create function public.telemetria_teto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recentes integer;
  teto constant integer := case tg_table_name when 'erros' then 300 else 3000 end;
begin
  if tg_table_name = 'erros' then
    select count(*) into recentes from public.erros where criado_em > now() - interval '1 minute';
  else
    select count(*) into recentes from public.eventos where criado_em > now() - interval '1 minute';
  end if;
  if recentes >= teto then
    raise exception 'telemetria acima do teto' using errcode = '54000';
  end if;
  new.criado_em := now();
  return new;
end;
$$;
revoke all on function public.telemetria_teto() from public, anon, authenticated;

create trigger erros_teto before insert on public.erros for each row execute function public.telemetria_teto();
create trigger eventos_teto before insert on public.eventos for each row execute function public.telemetria_teto();

-- Retenção: telemetria some depois de 90 dias.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
  'limpa-telemetria',
  '17 4 * * *',
  $$delete from public.erros where criado_em < now() - interval '90 days';
    delete from public.eventos where criado_em < now() - interval '90 days';$$
);
