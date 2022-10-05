/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
const fs = require(`fs`).promises;

const LEVELS_FILE_PATH = 'game/levels.json';

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to platform-game-builder-api!' });
});

app.get('/api/levels', async (req, res) => {
  const levels = await fs.readFile(LEVELS_FILE_PATH, `utf8`);
  res
    .status(200)
    .send(levels)
});

app.post('/api/levels', async (req, res) => {
  await fs.writeFile(LEVELS_FILE_PATH, JSON.stringify(req.body));
  res
    .status(200)
    .send()
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
