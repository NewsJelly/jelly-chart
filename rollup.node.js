import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/jelly.node.js',
    format: 'cjs',
    globals: {
      d3: 'd3',
      daum: 'daum'
    }  
 },
 plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ],
  external: ['d3']
};