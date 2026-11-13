/**
 * Configuração pública do app. Nada aqui é segredo: a chave publicável do
 * Supabase vai para o navegador por definição, e a segurança está nas
 * regras de acesso (RLS) do banco. Ver supabase/migrations e ADR-0002.
 */
declare const __VERSAO_APP__: string;

export const SUPABASE_URL = "https://htibjmqcxfbciqczfdrt.supabase.co";
export const SUPABASE_CHAVE_PUBLICA = "sb_publishable_sO-3-tF7IFgzYc7tn48u4A_obWV7zlM";
export const VERSAO_APP: string = typeof __VERSAO_APP__ === "string" ? __VERSAO_APP__ : "dev";
