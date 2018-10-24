const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const pkg = require('./package.json');

/**
 * Helper to transfet peerDependencies to object of externals
 * @param  {Object} peers - pkg.peerDependencies section
 * @return {Object} - { react: 'react', ... }
 */
function peersToExternals(peers){
  return Object.keys( peers || {} ).map( pkgName => pkgName )
  .reduce((obj, cur, i) => { return { ...obj, [cur]: cur }; }, {});
}

module.exports = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {

    // file name to generate is taken from main field of the package.json
    filename: path.basename(pkg.main),

    // path of the distribution is taken from the main field of the package json
    path: path.join(
      __dirname,
      //'../dist', // this part redirects output to EP's public folder
      path.dirname(pkg.main) )
    ,

    // name of the module is taken from package.json
    library: pkg.name,

    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  // externals section are generating from the peerDependencies section of the package.json
  // externals: peersToExternals(pkg.peerDependencies),

  externals : {
    react : {
      commonjs: 'react',
      commonjs2: 'react',
      umd: 'react',
      root: 'React' // indicates global variable
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      "node_modules",
      'packages',
      'src'
    ],
    mainFields: [
      'module',
      'main'
    ],
  },

  // ref: https://habr.com/post/350370/
  // optimization: {
  //     minimize: false,
  // },
};
