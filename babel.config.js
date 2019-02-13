module.exports = {
  plugins: [],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { safari: '12', chrome: '70', firefox: '64', edge: '17', node: '8' },
        useBuiltIns: false
      }
    ]
  ],
  babelrcRoots: ['.', './src/*']
};
