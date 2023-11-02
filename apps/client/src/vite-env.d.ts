/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HOST: string
  readonly POSTAPI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}