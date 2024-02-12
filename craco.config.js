const CracoAlias = require('craco-alias');

module.exports = {
  babel: {
    presets: ['@babel/preset-react'],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'jsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from jsconfig
        baseUrl: './src',
      },
    },
  ],
};
