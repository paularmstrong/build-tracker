module.exports = (api) => {
  return {
    babelrcRoots: ['./plugins/*', './src/*'],
    presets: [
      [
        '@babel/preset-env',
        {
          loose: !api.env('test'),
          modules: api.env('test') ? 'commonjs' : false,
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods'],
    env: {
      production: {
        ignore: ['**/__tests__/**'],
      },
    },
  };
};
