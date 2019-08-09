const gulp = require('gulp'),
      stylus = require('gulp-stylus'),
      gcmq = require('gulp-group-css-media-queries'),
      autoPrefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      browserSync = require('browser-sync').create(),
      imageMin = require('gulp-imagemin'),
      imgCompress  = require('imagemin-jpeg-recompress'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      babel = require('gulp-babel'),
      htmlMin = require('gulp-htmlmin'),
      del = require('del'),
      sourceMaps = require('gulp-sourcemaps'),
      smartGrid = require('smart-grid'),
      images = [
        './src/img/**/*.jpg',
        './src/img/**/*.gif',
        './src/img/**/*.png',
        './src/img/**/*.svg'
      ];



function html(){
    return gulp.src('./src/*.html')
            .pipe(htmlMin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest('./dist'))
}

function css(){
    return gulp.src('./src/css/style.styl')
            .pipe(stylus({
                'include css': true
            }))
            .pipe(gcmq())
            .pipe(autoPrefixer({
                overrideBrowserslist: ['> 0.1%'],
                cascade: false
            }))
            .pipe(cleanCSS({
                level: 2
            }))
            .pipe(gulp.dest('./dist/css'))
}

function js(){
    return gulp.src('./src/js/**/*.js')
           .pipe(concat('script.js'))
           .pipe(babel({
                presets: ['@babel/env']
            }))
           .pipe(uglify({
                toplevel: true
           }))
           .pipe(gulp.dest('./dist/js'))
}

function img(){
    return gulp.src(images)
            .pipe(imageMin([
                imgCompress({
                    loops: 4,
                    min: 70,
                    max: 80,
                    quality: 'high'
                }),
                imageMin.gifsicle(),
                imageMin.optipng(),
                imageMin.svgo()
            ]))
           .pipe(gulp.dest('./dist/img'))
}

function fonts(){
    return gulp.src('./src/fonts/**/*')
           .pipe(gulp.dest('./dist/fonts'))
}


function clear(){
	return del('./dist/*');
}

function watch(){
    browserSync.init({
        server: "./src"
    });

    gulp.watch('./src/*.html').on('change', browserSync.reload);
    gulp.watch('./src/css/**/*.styl').on('change', gulp.series(stylusCompiler, browserSync.reload));
    gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./src/img/**/*').on('change', browserSync.reload);
    gulp.watch('./src/fonts/**/*').on('change', browserSync.reload);
    gulp.watch('./smartgrid.js').on('change', grid);
}

function stylusCompiler() {
    return gulp.src('./src/css/style.styl')
        .pipe(sourceMaps.init())
        .pipe(stylus({
            'include css': true
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./src/css'))
}



function grid(done){
    delete require.cache[require.resolve('./smartgrid.js')];
    let settings = require('./smartgrid.js');
    smartGrid('./src/css', settings);
    done();
}

gulp.task('build',gulp.series(clear, gulp.parallel(html, css, js, img, fonts)));
gulp.task('clear', clear);
gulp.task('dev', watch);
gulp.task('grid', grid);
