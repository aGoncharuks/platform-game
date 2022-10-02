const fs = require(`fs`).promises;

export const readFileContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(`Failed to read file content: `, err);
    return [];
  }
};
