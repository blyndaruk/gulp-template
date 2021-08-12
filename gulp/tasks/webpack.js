import webpack from 'webpack';
import gutil from 'gulp-util';
import server from './server';
import config from '../config';

const webpackConfig = require('../../webpack.config.babel').createConfig(config.env);

function webpackPromise(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err)
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')))
      }

      server.server.reload();
      resolve()
    })
  })
  .catch((error) => {
    throw new gutil.PluginError('webpack', error.message);
  });
}


const build = gulp => gulp.series(webpackPromise);
const watch = gulp => gulp.series(webpackPromise);
// const watch = gulp => () => gulp.watch(config.src.js + '/**/*', gulp.parallel('webpack', webpackPromise));

module.exports.build = build;
module.exports.watch = watch;
