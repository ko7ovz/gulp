const
    gulp = require('gulp'),
    autoPrefixer = require('gulp-autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    isDev = process.argv.includes('--dev'),
    isProd = !isDev,
    isSync = process.argv.includes('--sync'),
    gcmq = require('gulp-group-css-media-queries'),
    stylus = require('gulp-stylus').stylus,
    build = gulp.series(clear, gulp.parallel(html, css, js, img, fonts));
    //cssFiles = [
    //    './node_modules/normalize.css/normalize.css',
    //    './node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    //    './src/css/**/main.css'
    //],
    jsFiles = [
        './src/js/*.js'
    ];

function html(){
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(gulpif(isSync, browserSync.stream()))
}

function css(){
    return gulp.src('./src/css/style.styl')
            .pipe(gulpif(isDev, sourcemaps.init()))
            .pipe(stylus())
            .pipe(concat('style.css'))
            .pipe(gcmq())
            .pipe(autoPrefixer({
                overrideBrowserslist: ['> 0.1%'],
                cascade: false
                }))
            .pipe(gulpif(isProd, cleanCSS({
                level: 2
                })))
            .pipe(gulpif(isDev, sourcemaps.write()))
            .pipe(gulp.dest('./dist/css'))
            .pipe(gulpif(isSync, browserSync.stream()))
}

function js(){
    return gulp.src(jsFiles)
        .pipe(gulp.dest('./dist/js'))
        .pipe(gulpif(isSync, browserSync.stream()))
}

function img(){
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img'))
        .pipe(gulpif(isSync, browserSync.stream()))
}

function fonts(){
    return gulp.src('./src/fonts')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(gulpif(isSync, browserSync.stream()))
}

function clear(){
    return del('./dist/*')
}


function watch(){
    if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./src",
	        }
	    });
    }

    gulp.watch('./src/**/*.html', html).on('change', browserSync.reload),
    gulp.watch('./src/css/**/*.styl', css).on('change', browserSync.reload).on('change', css),
    gulp.watch('./src/js/**/*.js', js).on('change', browserSync.reload),
    gulp.watch('./src/img/**/*', img).on('change', browserSync.reload),
    gulp.watch('./src/fonts/**/*', fonts).on('change', browserSync.reload);
}


gulp.task('html', html),
gulp.task('css', css),
gulp.task('js', js),
gulp.task('img', img),
gulp.task('fonts', fonts),
gulp.task ('clear', clear),
gulp.task('build', build),
gulp.task('watch', watch);
