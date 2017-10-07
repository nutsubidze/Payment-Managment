

var gulp = require('gulp');
var sass = require('gulp-sass');
var elixir = require('laravel-elixir');
require('laravel-elixir-minify-html');


gulp.task('sass:watch', function () {
    gulp.watch('resources/assets/scss/**/*.scss', ['sass']);
});
//sass
gulp.task('sass', function () {
    return gulp.src(['resources/assets/scss/**/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('public/css'))
        .pipe(sass.sync().on('error', sass.logError));
});

elixir(function (mix) {
    mix.html('storage/framework/views/*', 'storage/framework/views/', {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true
    });
});