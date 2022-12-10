import 'dotenv/config';

// Imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import xss from 'xss-clean';
import { config } from './config';

// Routes
import { router as AuthRouter } from './src/routes/auth.route';
import { router as NoteRouter } from './src/routes/note.route';
import { router as UserRouter } from './src/routes/user.route';

const app = express();

const port = process.env.APP_PORT || 4000;

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
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(xss());
app.use(cors({ credentials: true, origin: '*' }));

app.use(express.static(__dirname + '/public'));
app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.APP_SESSION_KEY as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
      httpOnly: true,
    },
  })
);

app.use((_req, res: any, next: NextFunction) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), payment=()');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  next();
});

app.use('/api/v1', UserRouter, AuthRouter, NoteRouter);

app.listen(config.server.port, () =>
  console.log(`This app is listening on port ${config.server.port}`)
);
