/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
const fs = require(`fs`).promises;

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to platform-game-builder-api!' });
});

app.get('/api/levels', async (req, res) => {
  const levels = await fs.readFile('game/levels.json', `utf8`);
  console.log(levels);
  res
    .status(200)
    .send(levels)
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
