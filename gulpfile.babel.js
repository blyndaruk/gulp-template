import gulp from 'gulp';
import config from './gulp/config';

const getTaskBuild = task => require('./gulp/tasks/' + task).build(gulp);
const getTaskWatch = task => require('./gulp/tasks/' + task).watch(gulp);

gulp.task('clean', getTaskBuild('clean'));
gulp.task('copy', getTaskBuild('copy'));
gulp.task('server', () => getTaskBuild('server'));
// gulp.task('nunjucks', () => getTaskBuild('twig'));
gulp.task('sass', () => getTaskBuild('sass'));
gulp.task('sprite:svg', () => getTaskBuild('sprite-svg'));
gulp.task('svgo', () => getTaskBuild('svgo'));
gulp.task('webpack', getTaskBuild('webpack'));
// gulp.task('zip', getTaskBuild('zip'));

gulp.task('copy:watch', getTaskWatch('copy'));
// gulp.task('nunjucks:watch', getTaskWatch('twig'));
gulp.task('sass:watch', getTaskWatch('sass'));
gulp.task('sprite:svg:watch', getTaskWatch('sprite-svg'));
gulp.task('svgo:watch', getTaskWatch('svgo'));
gulp.task('webpack:watch', getTaskWatch('webpack'));

const setmodeProd = done => {
  config.setEnv('production');
  config.logEnv();
  done();
}

const setmodeDev = done => {
  config.setEnv('development');
  config.logEnv();
  done();
}

gulp.task(
  'build',
  gulp.series(
    setmodeProd,
    'clean',
    'sprite:svg',
    'svgo',
    'sass',
    // 'nunjucks',
    'webpack',
    'copy',
    // 'zip'
  )
);

gulp.task(
  'build:dev',
  gulp.series(
    setmodeDev,
    'clean',
    'sprite:svg',
    'svgo',
    'sass',
    // 'nunjucks',
    'webpack',
    'copy'
  )
);

gulp.task(
  'watch',
  gulp.parallel(
    'copy:watch',
    // 'nunjucks:watch',
    'sprite:svg:watch',
    'svgo:watch',
    'webpack:watch',
    'sass:watch'
  )
);
//
// gulp.task('watch', function () {
//   gulp.watch(config.src.root).on('change', browserSync.reload);
//   gulp.watch(config.src.root).on('change', gulp.series('copy', 'sprite:svg', 'svgo', 'webpack', 'sass', browserSync.reload));
// });
//
//
// gulp.task('default', gulp.series(
//   gulp.parallel('watch', 'server')
// ));

gulp.task('default', gulp.series(['build:dev', 'server', 'watch']));
