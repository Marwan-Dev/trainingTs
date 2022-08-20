import express, { Application, Request, Response } from 'express';

const PORT = 3000;

// Create Instance Server
const app: Application = express();

// Routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

export default app;
