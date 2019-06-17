const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
   './src/css/main.scss'
]

const jsFiles = [
   './src/js/main.js'
]

function styles() {
   return gulp.src(cssFiles)
      //Компиляция sass
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         browsers: ['last 2 versions'],
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      //Выходная папка для стилей
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
}

function scripts() {
   return gulp.src(jsFiles)
      //Объединение файлов в один
      .pipe(concat('script.js'))
      //Минификация JS
      .pipe(uglify({
         toplevel: true
      }))
      //Выходная папка для скриптов
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
}

//Удалить всё в указанной папке
function clean() {
   return del(['build/*'])
}

//Просматривать файлы
function watch() {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
   gulp.watch('./src/css/**/*.scss', styles)
   gulp.watch('./src/section/**/*.scss', styles)
   gulp.watch('./src/js/**/*.js', scripts)
   gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('dev', gulp.series('build', 'watch'));