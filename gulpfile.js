const gulp = require('gulp');
const pug = require('gulp-pug');
const electron = require('electron-connect').server.create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const routes = require('./router.js').routes;

gulp.task('make_bundle', ()=> {
  for(var i = 0; i < routes.length; i++){
    webpackStream(webpackConfig.config(routes[i]), webpack)
    .pipe(gulp.dest('./dist/asset/bundles'));
  }
});

gulp.task('pug_compile', () => {
  return gulp.src(['./src/**/*.pug', '!./pug/**/_*.pug'])
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('asset_copy', () => {
  gulp.src(['src/asset/**'], {base: 'src/asset'})
  .pipe(gulp.dest('./dist/asset'));
});

gulp.task('pack', () => {
  gulp.run('pug_compile');
  gulp.run('asset_copy');
  gulp.run('make_bundle');
});

gulp.task('start', () =>{
  gulp.run('pack');

  gulp.watch(['./src/**'], () =>{
    gulp.run('pack');
  });
  gulp.watch(['./main.js'], electron.restart);

  electron.start();
});
