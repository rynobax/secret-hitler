const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');

gulp.task('clean', () => {
  return del(['./public/**/*']);
});

gulp.task('js', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('other', () => {
    return gulp.src(['./src/**/*', '!./src/**/*.js'])
        .pipe(gulp.dest('./public'));
});

gulp.task('rebuild', ['clean'], () => {
    return gulp.task('build', ['js', 'other'])
})

gulp.task('watch', () => {
    gulp.watch('./src/**/*', ['rebuild']);
})

gulp.task('default', ['watch']);

gulp.task('run', ['rebuild'], () => {
    const server = require('./server.js');
    const args = process.argv.slice(2);
    server.start(args[0]); 
})