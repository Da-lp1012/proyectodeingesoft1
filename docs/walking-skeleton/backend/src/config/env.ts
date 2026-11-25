export interface Env {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}

const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

// Se valida todo junto para fallar al arrancar con un mensaje claro,
// en vez de un error confuso de conexión más adelante.
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const missing = requiredVars.filter((name) => !source[name]);
  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
        'Revisa tu archivo .env (ver .env.example).',
    );
  }

  return {
    port: Number(source.PORT ?? 3000),
    db: {
      host: source.DB_HOST as string,
      port: Number(source.DB_PORT),
      name: source.DB_NAME as string,
      user: source.DB_USER as string,
      password: source.DB_PASSWORD as string,
    },
  };
}
