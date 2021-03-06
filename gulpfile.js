const del          = require('del'),
      gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      babel        = require('gulp-babel'),
      rename       = require('gulp-rename'),
      notify       = require('gulp-notify'),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      cleanCSS     = require('gulp-clean-css'),
      sourcemaps   = require('gulp-sourcemaps'),
      htmlreplace  = require('gulp-html-replace'),
      browserSync  = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

const reload = browserSync.reload;

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    port: 8888,
    notify: false
  });
});

gulp.task('serve:dist', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 9999,
    notify: false
  });
});

gulp.task('sass:dev', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'));
});

gulp.task('sass:prod', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass:prod'], function() {
  gulp.src('app/*.html')
    .pipe(htmlreplace({
      css: 'css/main.min.css',
      js: 'js/main.min.js'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));

  gulp.src('app/css/*.css')
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));

  gulp.src('app/js/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));

  gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['sass:dev', 'serve'], function() {
  gulp.watch('app/*.html', reload);
  gulp.watch('app/sass/**/*.sass', ['sass:dev', reload]);
  gulp.watch('app/js/**/*.js', reload);
  gulp.watch('app/img/**/*', reload);
});

gulp.task('default', ['watch']);
