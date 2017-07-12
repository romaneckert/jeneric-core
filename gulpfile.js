const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs');

gulp.task('js', () => {

    return browserify({entries: './test/index.js', debug:true})
        .transform('babelify', {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream('test/bundle.min.js'));

});

gulp.task('watch', () => {
    return gulp.watch(['./**/*.js'], ['js']);
});

gulp.task('default', ['js'], () => {
    gulp.start('watch');
});