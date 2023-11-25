import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"],
    }),
    POSTGRES_DB: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_PATH: str(),
    PORT: port({ default: 8000 }),
  });
}

export default validateEnv;
