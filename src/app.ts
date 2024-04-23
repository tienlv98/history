import 'reflect-metadata';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import * as swaggerUI from 'swagger-ui-express';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { PerformanceObserver } from 'node:perf_hooks';
import { ResponseMiddleware } from '@middlewares/response.middleware';
import config from './config';
import { RegisterRoutes } from './routes';
import * as swaggerJson from './swagger.json';
import rateLimiter from '@middlewares/rate-limit.middleware';
import { IncomingHttpHeaders } from 'http';
import {EnumEnv} from "./config/config.interface";

export default class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    this.app = express();
    this.env = config.appEnv || EnumEnv.Development;
    this.port = config.appPort || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`🚀 Server listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  private initializeMiddlewares() {
    const performanceObserver = new PerformanceObserver((items) => {
      items.getEntries().forEach((entry) => {
        console.log(entry);
      });
    });
    performanceObserver.observe({
      entryTypes: ['measure', 'function'],
      buffered: true,
    });

    this.app.use(morgan(config.logLevel, { stream }));
    this.app.use(
      cors({
        'access-control-allow-credentials': true,
        'access-control-allow-headers':
          'origin, X-Requested-With,Content-Type,Accept, Authorization, Content-Type',
        methods: 'GET,POST,DELETE,PUT,PATCH',
        Accept: 'application/json',
        origin: true,
        withCredentials: true,
        credentials: config.corsOrigin,
      } as cors.CorsOptions | IncomingHttpHeaders),
    );
    this.app.use(hpp());
    this.app.use(ResponseMiddleware);
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    RegisterRoutes(this.app);
  }

  private initializeSwagger() {
    this.app.use(
      ['/openapi', '/docs', '/swagger'],
      swaggerUI.serve,
      swaggerUI.setup(swaggerJson),
    );
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
    this.app.use(rateLimiter);
  }
}
