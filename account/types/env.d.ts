/**
 * We can extends the env types here
 * @see https://vitejs.dev/guide/env-and-mode.html#env-files
 */
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_DOMAIN: string;
  readonly VITE_SUB_DOMAIN: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_AUTH_URL: string;
  readonly VITE_API_ACCOUNT_URL: string;
  readonly VITE_RECAPTCHA_KEY: string;
  readonly VITE_SOLANA_CLUSTER: string;
  readonly VITE_SOLANA_FEE_PAYER_PUBKEY: string;
  readonly VITE_SOLANA_ESCROW_ACCOUNT_AUTORITYS_PUBKEY: string;
  readonly VITE_SOLANA_ESCROW_AUTORITY_PUBKEY: string;
  readonly VITE_SOALANA_ESCORW_PROGRAMA_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
