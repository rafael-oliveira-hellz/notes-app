import 'dotenv/config';

// Imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import xss from 'xss-clean';

import UserController from 'controllers/user.controller';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(bodyParser.json());

// Configure Sessions Middleware
app.use(session({
  secret: process.env.SESSION_TOKEN as string,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 * 24 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(UserController.initializeRoutes);

// Assign Port
const port = process.env.APP_PORT || 4000;

app.listen(port, () => console.log(`This app is listening on port ${port}`));