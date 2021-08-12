import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'fs';
import webpack from "webpack";
import path from "path";
import glob from "glob";

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function createConfig (env) {
  if (env === undefined) env = process.env.NODE_ENV;
  const isProduction = env === 'production';
  const map = env === 'production' ? 'nosources-source-map' : 'cheap-module-source-map';

  function generateHtmlPlugins (templateDir) {
    const files = glob.sync(`${templateDir}/**/*.twig`, [])
    return files.map(item => {
      const replaced = item.replace('./src/pages/', '')
      const parts = replaced.split(".");
      const [name, extension] = parts;
      return new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        inject: false,
        minify: false,
      });
    });
    // })
  }

  const htmlPlugins = generateHtmlPlugins("./src/pages");


  const webpackConfig = {
    mode: isProduction ? 'production' : 'development',
    // context: path.join(__dirname, config.src.js),
    target: false,
    entry: {
      app: ['./src/js/app.js'],
    },
    output: {
      // path: path.join(__dirname, config.dest.js),
      path: path.join(__dirname, 'build'),
      // filename: '[name].js',
      filename: './js/[name].js',
      publicPath: '',
      chunkFormat: false,
      chunkLoading: false,
      wasmLoading: false,
    },
    devtool: map,
    watch: !isProduction,
    watchOptions: {
      aggregateTimeout: 500,
    },
    plugins: [
      // new webpack.optimize.CommonsChunkPlugin({
      //     name: 'vendor',
      //     filename: '[name].js',
      //     minChunks: Infinity
      // }),
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            formatter: require('eslint-formatter-pretty')
          }
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Promise: 'es6-promise-promise',
      }),
      new webpack.NoEmitOnErrorsPlugin(),

      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'static',
      //   analyzerPort: 4000,
      //   openAnalyzer: false,
      // }),
    ].concat(htmlPlugins),
    resolve: {
      extensions: ['.html', '.twig', '.js'],
      modules: ["node_modules"],
      alias: {
        TweenLite: path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
        TweenMax: path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
        TimelineLite: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
        TimelineMax: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
        ScrollMagic: path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
        'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
        'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
      },
    },
    optimization: {
      minimize: isProduction
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: [
            path.resolve(__dirname, 'node_modules'),
          ],
          loader: 'eslint-loader',
          options: {
            fix: true,
            cache: true,
            ignorePattern: path.resolve(__dirname, '/src/js/lib/'),
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [
            path.resolve(__dirname, 'node_modules'),
          ],
        },
        // { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
        // { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ },
        {
          test: /\.twig$/,
          use: [
            'raw-loader',
            {
              loader: 'twig-html-loader',
              options: {
                namespaces: {
                  'templates': path.join(__dirname, './src/templates'),
                  'layouts': path.join(__dirname, './src/templates/layouts'),
                  'partials': path.join(__dirname, './src/templates/partials'),
                  'components': path.join(__dirname, './src/templates/components'),
                  'mixins': path.join(__dirname, './src/templates/mixins'),
                  'pages': path.join(__dirname, './src/templates/pages'),
                },
                // debug: !isProduction,
                data: (context) => {
                  let globalData = {}
                  let fileData = {}
                  const contextPath = context.resourcePath;
                  const name = contextPath.split(path.sep).pop().split('.').shift();
                  const data = path.join(__dirname, `src/data/${name}.json`);
                  const global = path.join(__dirname, 'src/data/_global.json');

                  if (fs.existsSync(global)) {
                    context.addDependency(global);
                    globalData = context.fs.readJsonSync(global, { throws: false }) || {};
                  }

                  if (fs.existsSync(data)) {
                    context.addDependency(data);
                    fileData = context.fs.readJsonSync(data, { throws: false }) || {};
                  }

                  return ({ ...globalData, ...fileData }) || {};
                }
              }
            }
          ]
        }
      ],
    },
  };

  if (isProduction) {
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
    );
  }

  return webpackConfig;
}

module.exports = createConfig();
module.exports.createConfig = createConfig;
