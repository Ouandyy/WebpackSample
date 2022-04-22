const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const npmConf = require('npm-conf');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { getFilesFromDirectory } = require('./configs/webpack.helper');
const common = require('./webpack.common.js');

const SRC_DIR = path.join(__dirname, 'Features/');

const userConf = npmConf();

const file = userConf.get('file');
const analyze = userConf.get('analyze') || false;
const inputPort = npmConf().get('port') || 8080;

const devServerConfig = {
  hot: true,
  open: true,
  // overlay: true,
  historyApiFallback: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8888',
    },
  },
  compress: true,
};

const webpackPlugins = [
  new Dotenv({ path: '../.env' }),
  new HtmlWebpackPlugin({
    template: 'static/template.html',
    filename: 'index.html',
    inject: true,
  }),
];

if (analyze) webpackPlugins.push(new BundleAnalyzerPlugin());

const webpackConfigs = {
  mode: 'development',
  plugins: webpackPlugins,
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
};

if (file) {
  const singleAppConfig = file.split(' ').map((indFile) => {
    const filePath = `${SRC_DIR}${indFile}/${indFile}.jsx`;

    return merge(common, {
      entry: filePath,
      ...webpackConfigs,
    });
  });

  try {
    const singleCompiler = webpack(singleAppConfig);

    singleAppConfig.forEach((data, index) => {
      const port = Number(inputPort) + index;

      const newSingleServer = new WebpackDevServer(singleCompiler.compilers[index], {
        ...devServerConfig,
        open: `http://localhost:${port}`,
      });

      newSingleServer.listen(port, '0.0.0.0', () =>
        console.log(`Hot reload is up at port ${port}`)
      );
    });
  } catch (err) {
    console.log('fail to load dev server', err);
  }
} else {
  const allApp = getFilesFromDirectory(SRC_DIR).map((filePath) =>
    merge(common, {
      entry: filePath,
      ...webpackConfigs,
    })
  );

  const allCompiler = webpack(allApp);

  allApp.forEach((data, index) => {
    const port = Number(inputPort) + index;
    const newMultiServer = new WebpackDevServer(allCompiler.compilers[index], {
      ...devServerConfig,
      open: `http://localhost:${port}`,
    });

    newMultiServer.listen(port, '0.0.0.0', () => console.log(`Hot reload is up at port ${port}`));
  });
}
