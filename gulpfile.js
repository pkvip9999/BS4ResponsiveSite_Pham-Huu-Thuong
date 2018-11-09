var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var del = require('del');
var cache = require('gulp-cache');




gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Other watchers
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})
gulp.task('images', function(){
    return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
});
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});
gulp.task('clean:dist', function() {
    return del.sync('dist');
})
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})
gulp.task('build', function () {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
    )
})
gulp.task('default', function (callback) {
    runSequence(['sass','browserSync'], 'watch',
        callback
    )
})