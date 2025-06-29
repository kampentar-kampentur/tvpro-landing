const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/assets/socialIcons');

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.svg')) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Найти viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    console.log(`No viewBox in ${file}`);
    return;
  }
  const [minX, minY, width, height] = viewBoxMatch[1].split(/\s+/);

  // Удалить старые width/height
  content = content
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '');

  // Вставить новые width/height после viewBox
  content = content.replace(
    /viewBox="[^"]*"/,
    `viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}: width="${width}" height="${height}"`);
}); 