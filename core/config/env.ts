
interface Config {
  gemini: {
    apiKey: string;
  };
  app: {
    mode: string;
  };
}

function validateEnv(): Config {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('❌ API_KEY não configurada no ambiente.');
  }

  return {
    gemini: {
      apiKey: apiKey || '',
    },
    app: {
      mode: 'production',
    },
  };
}

export const config = validateEnv();
