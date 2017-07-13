const gulp = require('gulp');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const rename = require('gulp-rename');
const fs = require('fs');

gulp.task('js', () => {
    return  browserify({entries: ['./test/index.js'] , debug:true})
            .transform('babelify', {presets: ["es2015"]})
            .bundle()
            .pipe(fs.createWriteStream('test/bundle.js'));
});

gulp.task('js-uglify', () => {
    return  gulp.src('./test/bundle.js')
            .pipe(uglify())
            .pipe(rename('bundle.min.js'))
            .pipe(gulp.dest('./test/'));
});

gulp.task('reload', function () {
    return gulp.src('./**/*.html').pipe(connect.reload());
});

gulp.task('connect', function() {
    return connect.server({
        root: 'test/',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch(['./*.js', './test/index.js','./test/app/**/*.js'],  gulp.series('js', 'js-uglify', 'reload'));
});

gulp.task('default', gulp.series('js', 'js-uglify', gulp.parallel('connect', 'watch')));