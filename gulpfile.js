var gulp = require('gulp');
var pug = require('gulp-pug');
var electron = require('electron-connect').server.create();

gulp.task('pug_compile', () => {
  return gulp.src(['./src/**/*.pug', '!./pug/**/_*.pug'])
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('start', ['pug_compile'], () =>{
  electron.start();
  gulp.watch(['./src/**'], () =>{
    gulp.run('pug_compile');
  });
  gulp.watch(['./main.js'], electron.restart);
});
