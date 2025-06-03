import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import bootstrap from './main.server';
import { provideSsrDomain } from '@ecoma/nge-domain';
import { provideSsrCookie } from '@ecoma/nge-cookie';
import { provideSsrSvgInjector } from '@ecoma/nge-svg-injector';

/**
 * Tạo và cấu hình ứng dụng Express.
 * Xử lý các yêu cầu SSR và phục vụ tệp tĩnh.
 * @returns Ứng dụng Express đã được cấu hình
 */
export function app(): express.Express {
  const server = express();
  server.set('trust proxy', 'uniquelocal');

  const distFolder = join(__dirname, '../browser');
  const indexHtml = join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

  server.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  server.get("*", (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: 'REQUEST', useValue: req },
          { provide: 'RESPONSE', useValue: res },
          provideSsrSvgInjector(`${protocol}://${headers.host}${baseUrl}`),
          provideSsrDomain(req),
          provideSsrCookie(req),
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

/**
 * Khởi chạy máy chủ Express.
 * Lắng nghe các kết nối HTTP trên cổng được chỉ định.
 */
function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(+port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`Server started successfully. Listening on http://0.0.0.0:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
/* eslint-disable @typescript-eslint/naming-convention */
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}
/* eslint-enable @typescript-eslint/naming-convention */

export default bootstrap;
