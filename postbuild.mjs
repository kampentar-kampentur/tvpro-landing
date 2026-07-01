import { readFile, writeFile } from "fs/promises";
import path from "path";
import { JSDOM } from "jsdom";
import Beasties from "beasties";
import { readdir } from "fs/promises";

const outDir = path.join(process.cwd(), "out");

// рекурсивно собираем все html-файлы
async function getHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getHtmlFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files).filter((f) => f.endsWith(".html"));
}

async function processFile(file, beasties) {
  const html = await readFile(file, "utf8");

  // оптимизация beasties
  const optimized = await beasties.process(html);

  // сохраняем обратно
  await writeFile(file, optimized, "utf8");
  console.log(`✔ Optimized: ${file}`);
}

async function run() {
  const beasties = new Beasties({
    path: outDir,
    publicPath: "/",
    pruneSource: false, // не удаляем стили из исходных файлов для надежности
    preload: false, // загружаем стили синхронно, чтобы избежать FOUC (мигания стилей)
    inlineFonts: true,
    mergeStylesheets: true
  });

  const htmlFiles = await getHtmlFiles(outDir);
  for (const file of htmlFiles) {
    await processFile(file, beasties);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
