import gulp from 'gulp';
import zip from 'gulp-zip';

gulp.task('zip', () => gulp
  .src('build/**/*.*')
  .pipe(zip('build.zip'))
  .pipe(gulp.dest('build'))
);
const build = instance => instance.series('zip');

module.exports.build = build;
