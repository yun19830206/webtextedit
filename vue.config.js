const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  assetsDir: 'assets',
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))

    config.resolve.symlinks(true)
  },
  devServer: {
    host: 'localhost',
    port: 8103,
    hot: true,
    proxy: {
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/styles/index.scss";'
      }
    }
  },
  pluginOptions: {}
}