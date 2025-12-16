import esbuild from 'esbuild';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distElectronDir = join(process.cwd(), 'dist-electron');
if (!existsSync(distElectronDir)) {
  mkdirSync(distElectronDir, { recursive: true });
}

const electronMainPath = join(process.cwd(), 'electron', 'main.js');
const preloadSourcePath = join(process.cwd(), 'electron', 'preload.js');

if (!existsSync(electronMainPath)) {
  console.error('Electron main file not found at:', electronMainPath);
  process.exit(1);
}

if (!existsSync(preloadSourcePath)) {
  console.error('Preload file not found at:', preloadSourcePath);
  process.exit(1);
}

try {
  await esbuild.build({
    entryPoints: [electronMainPath],
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'esm',
    outfile: join(distElectronDir, 'main.js'),
    external: ['electron', 'electron-updater'],
  });
  console.log('Main process built successfully');
} catch (error) {
  console.error('Error building main process:', error);
  process.exit(1);
}

try {
  await esbuild.build({
    entryPoints: [preloadSourcePath],
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'cjs',
    outfile: join(distElectronDir, 'preload.js'),
    external: ['electron'],
  });
  console.log('Preload script built successfully');
} catch (error) {
  console.error('Error building preload script:', error);
  process.exit(1);
}

console.log('Electron build complete!');
