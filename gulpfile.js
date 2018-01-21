const gulp = require('gulp');
const exec = require('gulp-exec');

const conf = {
    reportOptions : {
        err: true,
        stderr: true,
        stdout: true
    }
};

gulp.task('jsdoc', () => {

    let commands = [
        'rm -rf doc',
        './node_modules/.bin/jsdoc -c jsdoc.json'
    ];

    let stream = gulp.src('./');

    for(let command of commands) {
        stream = stream.pipe(exec(command));
    }

    stream = stream.pipe(exec.reporter(conf.reportOptions));

    return stream;
});

gulp.task('watch', () => {
    gulp.watch(['app/**/*', 'web/**/*'], gulp.series('jsdoc'))
});

gulp.task(
    'default',
    gulp.series(
        'jsdoc',
        'watch'
    )
);