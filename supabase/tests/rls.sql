-- Teste das regras de acesso (RLS). Roda tudo numa transação e desfaz no fim.
-- Esperado: 1, 2, null, 20, 0, null, 0, 0, 20, 1 (na ordem dos casos).
begin;
insert into auth.users (id, email, aud, role) values
 ('00000000-0000-0000-0000-0000000000a1','teste-a@exemplo.invalid','authenticated','authenticated'),
 ('00000000-0000-0000-0000-0000000000b2','teste-b@exemplo.invalid','authenticated','authenticated');
create temp table r (caso text, resultado text) on commit drop;
grant all on r to anon, authenticated;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}',true);
insert into r select 'A cria (versao 0 -> 1)', public.salvar_progresso('{"xp":10}'::jsonb, 0)::text;
insert into r select 'A grava com versao certa (1 -> 2)', public.salvar_progresso('{"xp":20}'::jsonb, 1)::text;
insert into r select 'A grava com versao velha (conflito = null)', coalesce(public.salvar_progresso('{"xp":5}'::jsonb, 1)::text,'null');
insert into r select 'A le o proprio xp', (select estado->>'xp' from public.progresso);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}',true);
insert into r select 'B ve linhas de outros', count(*)::text from public.progresso;
update public.progresso set estado='{"xp":0}' where user_id='00000000-0000-0000-0000-0000000000a1';
insert into r select 'B tenta gravar por cima de A', coalesce(public.salvar_progresso('{"xp":0}'::jsonb, 2)::text,'null');
reset role; set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
insert into r select 'anon ve progresso', count(*)::text from public.progresso;
insert into public.eventos (sessao, versao_app, nome) values (gen_random_uuid(),'teste','abriu_app');
insert into r select 'anon le eventos', count(*)::text from public.eventos;
reset role;
insert into r select 'xp de A depois de tudo', (select estado->>'xp' from public.progresso where user_id='00000000-0000-0000-0000-0000000000a1');
insert into r select 'eventos gravados (admin)', count(*)::text from public.eventos;
select * from r;
rollback;
