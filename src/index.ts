import 'dotenv/config';

// Imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';
import xss from 'xss-clean';
import { config } from './config/config';
import logger from './config/winston-logger';
import swaggerFile from './public/swagger_output.json';

// Routes
import { router as AuthRouter } from './routes/auth.route';
import { router as NoteRouter } from './routes/note.route';
import { router as UserRouter } from './routes/user.route';
import { updateNotesStatus } from './utils/UpdateNotesStatus';

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'"],
      upgradeInsecureRequests: null,
    },
  })
);
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// app.use(helmet.noSniff());
// app.use(helmet.xssFilter());
// app.use(xss());
app.use(cors({ credentials: true, origin: '*' }));

app.use(express.static(__dirname + '/public'));
app.set('trust proxy', 1);

// app.use(
//   session({
//     secret: process.env.APP_SESSION_KEY as string,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       sameSite: 'none',
//       secure: true,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//       httpOnly: true,
//     },
//   })
// );

// app.use((_req, res: any, next: NextFunction) => {
//   res.setHeader(
//     'Strict-Transport-Security',
//     'max-age=31536000; includeSubDomains'
//   );
//   res.setHeader('X-Frame-Options', 'DENY');
//   res.setHeader('X-XSS-Protection', '1; mode=block');
//   res.setHeader('Permissions-Policy', 'geolocation=(), payment=()');
//   res.setHeader('X-Download-Options', 'noopen');
//   res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
//   res.setHeader('X-DNS-Prefetch-Control', 'off');

//   next();
// });

app.use('/api/v1', UserRouter, AuthRouter, NoteRouter);
app.get('/', (_req, res) => res.send('APP is working!'));
app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const task = cron.schedule(
  '0 1 * * *',
  () => {
    logger.info('Running a job at 01:00 at America/Sao_Paulo timezone');
    updateNotesStatus();
  },
  {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
  }
);

try {
  task.start();
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error(error.message);
  }

  const count = 5;

  while (count < 5) {
    setTimeout(() => {
      task.start();
    }, 1000 * 60);
  }
}

app.listen(config.server.port, () =>
  console.log(`This app is listening on port ${config.server.port}`)
);
