const path = require('path');
const glob = require('glob');

// include the js minification plugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin')
const PATHS = {
  src: path.join(__dirname, 'assets')
}
const assets = glob.sync('./assets/*/*.*');
let entries =  assets.reduce(function(obj, el){
         
  let elObj = path.parse(el);

  if(elObj.base !== 'app.scss'  && elObj.base !=='dashboard.scss') {

    obj[elObj.name] = [el];

  }
  return obj;
},{})

 entries.frontend.push('./assets/sass/app.scss');
 entries.admin.push('./assets/sass/dashboard.scss');

module.exports = {

  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-build.js',
  },
  module: {
    rules: [
      // perform js babelization on all .js files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['babel-preset-env']
         }
        }
      },
      // compile all .scss files to plain old css
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    // extract css into dedicated file
    new MiniCssExtractPlugin({
      filename: '/css/[name].min.css'
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(path.join(__dirname, '.php')),
    // })
  ],
  optimization: {
    minimizer: [
      // enable the js minification plugin
      new UglifyJSPlugin({
        cache: true,
        parallel: true
      }),
      // enable the css minification plugin
      new OptimizeCSSAssetsPlugin({
        
      })
    ]
  }
};