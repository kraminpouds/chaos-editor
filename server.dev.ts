import { APP_BASE_HREF } from '@angular/common';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as cookieParser from 'cookie-parser';
import { environment } from 'env';
import * as express from 'express';
import { existsSync } from 'fs';
import * as morgan from 'morgan';
import { join } from 'path';
import { v4 } from 'uuid';
import 'zone.js/node';

import { AppServerModule } from './src/main.server';

morgan.token('id', req => (req as any).id);

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.set('trust proxy', 'loopback');
  const router = express.Router();
  const devLogger = ':id :method :status :url :response-time ms - :res[content-length]';
  server.use((req, res, next) => {
    (req as any).id = v4();
    next();
  });

  server.use(morgan(devLogger));
  server.use(cookieParser());

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // router.get('/oauth', DoOAuth);
  // mock api
  // const apiRouter = express.Router();
  // server.use('/dev', apiRouter);
  // server.use('/qa', apiRouter);

  // Serve static files from /browser
  router.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  router.get('*', [], (req: express.Request, res: express.Response) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  // mount the router on to the base url
  server.use(environment.baseHref, router);

  return server;
}

function run(): void {
  const port = process.env.PORT || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
