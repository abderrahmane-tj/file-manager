const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cssClean = require('gulp-clean-css');
const gls = require('gulp-live-server');
const runSequence = require('run-sequence');
const livereload = require('gulp-livereload');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');


gulp.task('build-scss', function () {
  return gulp.src('resources/assets/sass/app.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({}).on('error', swallowError))
    .pipe(concat('app.css'))
    // .pipe(sourcemaps.write('.'))
    // .pipe(autoprefixer({
    //   browsers: ['last 3 versions'],
    //   cascade: false
    // }))
    // .pipe(cssClean({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});
gulp.task('vendor-css',function () {
  // return gulp.src([
  //   "node_modules/bootstrap/dist/css/bootstrap.min.css"
  // ])
  // .pipe(sourcemaps.init())
  // .pipe(concat('vendor.css'))
  // .on('error', swallowError)
  // .pipe(sourcemaps.write('.'))
  // .pipe(gulp.dest('./build/styles'));
});
gulp.task('build-ts', function () {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
    // .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js/app'))
    .pipe(livereload());
});
gulp.task('system-js',function () {
  return gulp.src([
    "./node_modules/systemjs/dist/system.src.js",
    "./systemjs.config.js"
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('system.js'))
    .on('error', swallowError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("public/js"))
    .pipe(livereload());
});
// gulp.task('fonts',function () {
//   return gulp.src(["./node_modules/font-awesome/fonts/*"])
//     .pipe(gulp.dest("public/fonts"));
// });
// gulp.task('images',function () {
//   return gulp.src(["./src/images/**/*.*"])
//     .pipe(gulp.dest("./build/images"))
//     .pipe(livereload());
// });
// gulp.task('html',function(){
//   return gulp.src(["./src/index.html"])
//     .pipe(inline({
//       disabledTypes: ['img', 'js','css'],
//       ignore: [
//         'images/home/logo.svg',
//         'images/home/offices.svg',
//         'images/home/city-monuments.svg',
//         'images/agency/bg-line.svg',
//         'images/clients/handle.svg',
//         'images/clients/flying-taher.svg',
//         'images/contact/dot.svg',
//         'images/contact/maroc.svg',
//         'images/contact/dubai.svg',
//         'images/contact/egypt.svg'
//       ]
//     }))
//     .pipe(gulp.dest("./build"))
//     .pipe(livereload());
// });
gulp.task('build', function (cb) {
  runSequence('build-scss'/*,'vendor-css'*/,'build-ts'/*,'bundle-ts'*/,'system-js',cb);
});
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('resources/assets/sass/**/*.scss', ['build-scss']);
  gulp.watch(['resources/assets/ts/**/*.ts','resources/assets/ts/**/*.tsx'], ['build-ts']);
  gulp.watch('systemjs.config.js', ['system-js']);
  // gulp.watch('./build/**/*', liveReload);
  // gulp.watch('./src/server/**/*', restartServer);
});
gulp.task('default', function (cb) {
  runSequence('build','watch',cb);
});
/// LAZY DEV SECTION ///
gulp.task('lazy-copy',function(cb){
  runSequence('copy-node-modules','copy-bootstrap-fonts',cb);
});
gulp.task('copy-node-modules',function () {
  const folders = [
    "moment",
    "classnames",
    "rxjs",
    "react-router",
    "react-dom",
    "react",
  ].map(folder=>`./node_modules/${folder}/**/*`);
  return gulp.src(folders,{base:'./node_modules/'})
    .pipe(gulp.dest("public/node_modules"))
});
gulp.task('copy-bootstrap-fonts',function () {
  return gulp.src('./node_modules/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest("public/fonts"))
});
///   PRODUCTION    ///
gulp.task('bundle-ts', function(cb) {
  let path = require("path");
  let Builder = require('systemjs-builder');
  let builder = new Builder('', 'systemjs.config.js');
  builder
    .buildStatic('public/js/app/main.js', 'public/js/app.js', {
      minify: true, sourceMaps: true
    })
    .then(function() { console.log('Build complete'); livereload.reload(); cb(); })
    .catch(function(err) { console.log('Build error'); console.log(err);});
});
////////////////////////
function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}