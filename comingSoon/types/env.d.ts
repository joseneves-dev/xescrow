/**
 * We can extends the env types here
 * @see https://vitejs.dev/guide/env-and-mode.html#env-files
 */
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_DOMAIN: string;
  readonly VITE_API_URL: string;
  readonly VITE_RECAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
