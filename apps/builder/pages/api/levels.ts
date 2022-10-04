const fs = require(`fs`).promises;

export default async function handler(req, res) {
  const levels = await fs.readFile('game/levels.json', `utf8`);
  res
    .status(200)
    .send(levels)
}
