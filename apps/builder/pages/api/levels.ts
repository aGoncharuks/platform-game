import { readFileContent } from '../../utils/file-system';

export default async function handler(req, res) {
  const levels = await readFileContent('old/levels.js');
  console.log(levels);
  res
    .status(200)
    .json(levels);
}
