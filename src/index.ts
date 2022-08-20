import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import errorMiddleware from './middlewares/error.middleware';
import config from './config';
import db from './database';

const PORT = config.port || 3000;

// Create Instance Server
const app: Application = express();
// Middleware to parse incomming requests
app.use(express.json());
// HTTP request logger middleware
app.use(morgan('common'));
// Rate limit for all requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try after one hour',
  })
);
// HTTP request security middleware
app.use(helmet());
// Routing for / path
app.get('/', (req: Request, res: Response) => {
  throw new Error('Error Exists');
  res.json({
    message: 'Hello World',
  });
});
// Post request
app.post('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World from Post Request',
    data: req.body,
  });
});

// db.connect().then((client) => {
//   return client
//     .query('SELECT NOW()')
//     .then((res) => {
//       client.release();
//       console.log(res.rows);
//     })
//     .catch((err) => {
//       client.release();
//       console.log(err.stack);
//     });
// });

// Error Middleware
app.use(errorMiddleware);
// handle route not exist
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'You are lost, Please check API docs.',
  });
});
// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

export default app;
