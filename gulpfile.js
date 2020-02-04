const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-image');
const del = require('del');
const browserSync = require('browser-sync').create();

function styles() {
   return gulp.src('./src/css/main.scss')
      //Компиляция sass
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 2 versions'],
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

function images() {
   return gulp.src('./src/img/*')
       .pipe(image())
       .pipe(gulp.dest('./build/img'));
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
   gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('image', images);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, images)));
gulp.task('dev', gulp.series('build', 'watch'));
