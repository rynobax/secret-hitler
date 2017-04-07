const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const gulpSequence = require('gulp-sequence')
//const server = require('./server.js');

gulp.task('clean', (done) => {
  del(['./public/**/*']);
  done();
});

gulp.task('other', () => {
    return gulp.src(['./src/**/*', '!./src/**/*.js'])
        .pipe(gulp.dest('./public'));
});

gulp.task('js', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('rebuild', (done) => gulpSequence('clean', 'other', 'js')(done));

gulp.task('run', ['rebuild'], () => {
    require('./server.js').start(80);
});

gulp.task('watch', ['run'], () => {
    gulp.watch('./src/**/*', ['run']);
})

gulp.task('default', ['watch']);

gulp.task('start-dev', ['watch']);

gulp.task('start', ['run']);