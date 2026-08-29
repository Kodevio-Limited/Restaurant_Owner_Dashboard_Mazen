// Cross-platform Next.js cache cleaner.
// Removes stale build artifacts that cause "Cannot find module './xxx.js'" /
// "__webpack_modules__[moduleId] is not a function" runtime errors.
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const targets = ['.next', 'node_modules/.cache', 'node_modules/.next'];

await Promise.all(
  targets.map((t) =>
    rm(join(root, t), { recursive: true, force: true })
      .then(() => console.log(`✔ removed ${t}`))
      .catch(() => {}),
  ),
);

console.log('Clean complete.');