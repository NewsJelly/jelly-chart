import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'index.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'jelly',
    sourcemap: true,
    paths: {
      d3: 'https://d3js.org/d3.v4.min'
    },
    globals: {
      d3: 'd3'
    }
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ["external-helpers"]
    })
  ],
  external: ['d3']
};