import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'framer-motion',
    'next',
    'next/navigation',
  ],
  onSuccess: async () => {
    // tsup/esbuild's `banner` option places content AFTER imports, but Next.js
    // requires `'use client'` to be the very first line of the file. We prepend
    // it manually after the bundle is written.
    const fs = await import('node:fs/promises');
    const directive = "'use client';\n";
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      const contents = await fs.readFile(file, 'utf8');
      if (!contents.startsWith("'use client'")) {
        await fs.writeFile(file, directive + contents);
      }
    }
  },
});
