const path = require('path');
const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const npmConf = require('npm-conf');
const common = require('./webpack.common.js');
const { getFilesFromDirectory } = require('./configs/webpack.helper');

const SRC_DIR = path.join(__dirname, 'Features/');

const userConf = npmConf();
const file = userConf.get('file');

const htmlPlugins = getFilesFromDirectory(SRC_DIR).map((filePath) => {
  const fileName = filePath.replace(SRC_DIR, '');
  return new HtmlWebpackPlugin({
    chunks: [fileName.replace(path.extname(fileName), '').split(path.sep)[0]],
    template: 'static/template.html',
    filename: `${fileName.split(path.sep)[1].split('.')[0]}${path.sep}index.html`,
    inject: true,
  });
});

let entry = getFilesFromDirectory(SRC_DIR).reduce((entries, filePath) => {
  const entryChunkNameFormat = filePath.replace(path.extname(filePath), '').replace(SRC_DIR, '');
  const entryChunkName = entryChunkNameFormat.split(path.sep)[0];
  entries[entryChunkName] = [filePath];

  return entries;
}, {});
let plugins = [new CleanWebpackPlugin(), ...htmlPlugins, new Dotenv({ path: '../.env' })];

if (file) {
  let fileArr = file.split(' ');
  plugins = [...htmlPlugins, new Dotenv({ path: '../.env' })];
  const newEntry = {};
  const fileNoExist = [];
  // Find files that exist
  fileArr = fileArr.filter((filenames) => {
    if (!entry[filenames]) {
      fileNoExist.push(filenames);
    }
    return entry[filenames];
  });
  fileArr.forEach((filenames) => {
    newEntry[filenames] = entry[filenames];
  });

  entry = newEntry;

  console.log('\x1b[32m%s\x1b[0m', `Files being built: ${fileArr.join(', ')}`);
  // ERROR HANDLER
  if (fileNoExist.length) {
    console.log('\x1b[31m%s\x1b[0m', '!!!!!!', '\n');
    console.error('\x1b[31m%s\x1b[0m', `File does not exist: ${fileNoExist.join(', ')}`, '\n');
    console.log('\x1b[31m%s\x1b[0m', '!!!!!!', '\n');
  }
}

module.exports = merge(common, {
  mode: 'production',
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: false,
  entry,
  plugins,
  output: {
    filename: '[name]/build/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
});
