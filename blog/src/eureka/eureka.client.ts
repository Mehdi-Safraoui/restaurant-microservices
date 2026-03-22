import { networkInterfaces } from 'os';

const { Eureka } = require('eureka-js-client');

export interface EurekaOptions {
  appName: string;
  port: number;
  hostName?: string;
  ipAddr?: string;
}

export class EurekaClient {
  private readonly client: any;
  private started = false;

  constructor(options: EurekaOptions) {
    const {
      appName,
      port,
      hostName = process.env.SERVICE_HOST ?? getLocalIp(),
      ipAddr = process.env.SERVICE_IP ?? hostName,
    } = options;

    const eurekaHost = process.env.EUREKA_HOST ?? 'localhost';
    const eurekaPort = Number(process.env.EUREKA_PORT ?? 8761);
    const servicePath = process.env.EUREKA_SERVICE_PATH ?? '/eureka/apps/';

    this.client = new Eureka({
      instance: {
        app: appName.toUpperCase(),
        hostName,
        ipAddr,
        vipAddress: appName,
        instanceId: `${hostName}:${appName}:${port}`,
        statusPageUrl: `http://${hostName}:${port}/health`,
        healthCheckUrl: `http://${hostName}:${port}/health`,
        port: {
          $: port,
          '@enabled': true,
        },
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: eurekaHost,
        port: eurekaPort,
        servicePath,
        maxRetries: Number(process.env.EUREKA_MAX_RETRIES ?? 3),
        requestRetryDelay: Number(process.env.EUREKA_RETRY_DELAY ?? 2000),
        fetchRegistry: false,
        registerWithEureka: true,
      },
    });
  }

  async start(): Promise<void> {
    if (this.started) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.client.start((error: Error | undefined) => {
        if (error) {
          return reject(error);
        }
        this.started = true;
        return resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.client.stop((error: Error | undefined) => {
        if (error) {
          return reject(error);
        }
        this.started = false;
        return resolve();
      });
    });
  }
}

export const createEurekaClient = (options: EurekaOptions): EurekaClient =>
  new EurekaClient(options);

const getLocalIp = (): string => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
};
