const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

module.exports = ({ mode }) => {
  return {
    mode: mode ?? 'development',
    entry: path.resolve(__dirname, './src/index'),
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [mode === 'development' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
        {
          test: /\.ts$/i,
          use: 'ts-loader',
        },
        {
          test: /\.(jpg|png|svg|jpeg|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, './dist'),
      clean: true,
      assetModuleFilename: 'assets/[name][ext]',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        favicon: './src/public/favicon.png',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[contenthash].css',
      }),
      new EslingPlugin({ extensions: 'ts' }),
    ],
  };
};
