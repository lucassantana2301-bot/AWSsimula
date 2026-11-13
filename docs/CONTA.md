# Conta, sincronização e telemetria

Supabase próprio: projeto `cloudquest` (`htibjmqcxfbciqczfdrt`, São Paulo). Decisões no ADR-0002.

## O que fica onde

| Tabela             | Quem lê                                    | Quem escreve                              | Observação                                                             |
| ------------------ | ------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------- |
| `progresso`        | o próprio usuário (RLS)                    | o próprio usuário, via `salvar_progresso` | 1 linha por conta, `jsonb` de até 512 KB, versão para escrita otimista |
| `erros`, `eventos` | ninguém pela API (só o painel do Supabase) | qualquer um, só insert                    | teto global por minuto (trigger) e limpeza depois de 90 dias (pg_cron) |
| `admins`           | o próprio admin                            | ninguém pela API                          | quem estiver aqui vê o painel dentro do app                            |

As migrações estão em `supabase/migrations/`, e o teste das regras de acesso em `supabase/tests/rls.sql`. Esse teste roda numa transação e desfaz tudo no fim.

## Configuração no painel do Supabase (uma vez)

1. **Authentication → URL Configuration**
   - Site URL: `https://awssimula.vercel.app`
   - Redirect URLs:
     - `https://awssimula.vercel.app/**`
     - `https://awssimula-*-lucassantana2301-bots-projects.vercel.app/**` (previews)
     - `http://localhost:4173/**`
   - Sem isso, o link do e-mail volta para `localhost:3000`.
2. **Authentication → Emails → SMTP** (obrigatório para seguidores entrarem)
   - O e-mail padrão do Supabase só envia para membros do time do projeto e tem limite baixo por hora.
   - Crie uma conta grátis num serviço de envio (Resend, Brevo, AWS SES) e preencha host, porta, usuário e senha.
   - Depois, em **Rate Limits**, ajuste o limite de e-mails por hora.
3. **Virar admin do painel**: entre no app com o seu e-mail uma vez e rode no SQL editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = '<seu e-mail>';
   ```

## Privacidade

- **Telemetria sem dado pessoal:** sem e-mail, sem id de conta, só o navegador resumido. As mensagens passam por `limpar()`, que remove e-mails, tokens e parâmetros de URL.
- **Nunca envia** de build local, do CI ou de localhost (`ambienteDeProducao`).
- **Eventos de uso** respeitam Do Not Track, GPC e a opção do aluno no Perfil.
- **Apagar dados:** "Apagar progresso da conta" remove a linha de `progresso`. A conta de e-mail continua em `auth.users` até ser removida no painel.
