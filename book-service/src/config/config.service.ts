class ConfigService {
  constructor(private env: string | undefined) {}

  public isProduction(): boolean {
    return this.env === 'production';
  }

  public getEnv() {
    return this.env || 'development';
  }

  public getBrokerUri() {
    return process.env.BROKER_URI ?? 'amqp://guest:guest@rabbitmq:5672';
  }

  public getPort() {
    return process.env.PORT ?? 3003;
  }

  public getPostgresHost() {
    return process.env.DB_HOST ?? 'localhost';
  }

  public getPostgresPort() {
    return Number(process.env.DB_PORT) ?? 5432;
  }

  public getPostgresUser() {
    return process.env.DB_USER ?? 'admin';
  }

  public getPostgresPassword() {
    return process.env.DB_PASSWORD ?? 'password';
  }

  public getPostgresDb() {
    return process.env.DB_NAME ?? 'book_db';
  }
}

const configService = new ConfigService(process.env.NODE_ENV);

export { configService };
