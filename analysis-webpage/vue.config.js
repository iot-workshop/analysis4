const API_URL = {
  production: JSON.stringify('https://workshop-functions4.azurewebsites.net'),
  development: JSON.stringify('https://localhost:8082')
};

// check environment mode
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  publicPath: '/analysis4/',
  devServer: {
    port: 8082,
    https: true,
    proxy: {
      '^/api': {
        'target': 'https://workshop-functions4.azurewebsites.net',
        'ws': true,
        'changeOrigin': true
      },
      '^/client': {
        'target': 'https://realdata4.service.signalr.net/',
        'ws': true,
        'changeOrigin': true
      }
    },
  },
  "chainWebpack": (config) => {
    config.plugin('define').tap((definitions) => {
      definitions[0]['API_URL'] = API_URL[environment];
      return definitions;
    });
  },
  lintOnSave: false
}
