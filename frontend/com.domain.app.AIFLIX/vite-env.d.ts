/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_REDUX_DEV_TOOLS_ENABLED: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  