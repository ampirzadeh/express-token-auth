import * as esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  target: ['node10.4'],
  external: ['nock', 'aws-sdk', 'mock-aws-s3'],
  minify: true,
  outfile: 'dist/app.js',
})
