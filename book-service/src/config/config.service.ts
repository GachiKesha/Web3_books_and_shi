class ConfigService {
  constructor(private env: string | undefined) {}

  public isProduction(): boolean {
    return this.env === 'production';
  }

  public getEnv() {
    return this.env || 'development';
  }

  public getBrockerUri() {
    return process.env.BROCKER_URI ?? 'amqp://rabbitmq:5672';
  }

  public getPort() {
    return process.env.PORT ?? 3001;
  }

  public getPostgresHost() {
    return process.env.POSTGRES_HOST ?? 'localhost';
  }

  public getPostgresPort() {
    return Number(process.env.POSTGRES_PORT) ?? 5432;
  }

  public getPostgresUser() {
    return process.env.POSTGRES_USER ?? 'admin';
  }

  public getPostgresPassword() {
    return process.env.POSTGRES_PASSWORD ?? 'password';
  }

  public getPostgresDb() {
    return process.env.POSTGRES_DB ?? 'book_db';
  }
}

const configService = new ConfigService(process.env.NODE_ENV);

export { configService };
