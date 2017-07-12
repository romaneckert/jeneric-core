const gulp = require('gulp');
const connect = require('gulp-connect');
const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');

gulp.task('js', () => {

    return browserify({entries: './test/index.js', debug:true})
    .transform('babelify', {presets: ["es2015"]})
    .bundle()
    .pipe(fs.createWriteStream('test/bundle.min.js'));
});

gulp.task('reload', function () {
    return gulp.src('./**/*.html').pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'test/',
        livereload: true
    });
});

gulp.task('watch', () => {
    gulp.watch(['./test/**/*'], ['reload']);
    gulp.watch(['./**/*.js'], ['js']);
});

gulp.task('default', ['connect', 'js'], () => {
    gulp.start('watch');
});