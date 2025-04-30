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
    return process.env.PORT ?? 3001;
  }
}

const configService = new ConfigService(process.env.NODE_ENV);

export { configService };
