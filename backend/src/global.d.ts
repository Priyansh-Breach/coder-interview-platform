declare namespace NodeJS {
  interface ProcessEnv {
    HUGGINGFACE_API_KEY: string;
    PORT?: string;
    // Add any other environment variables here
  }
}
