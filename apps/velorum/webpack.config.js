module.exports = (config, options, targetOptions) => {
  config.module?.rules?.push(
    {
      test: /\.(glsl|vs|fs)$/,
      use: [
        {
          loader: 'shader-loader'
        }
      ]
    }
  );

  // Keep class names in prod
  config.optimization.minimizer
    .filter (({constructor: {name}}) => name === 'JavaScriptOptimizerPlugin')
    .forEach (terser => {
      terser.options.keepNames = true;
      terser.options.keepIdentifierNames = true;
    });

  return config;
};

