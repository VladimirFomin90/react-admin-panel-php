const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');

const basePath =
    '/home/vladimir/Documents/devilbox/data/www/phpAdminWithReact/htdocs/admin';

gulp.task('copy-html', () => {
    return gulp.src('./app/src/index.html').pipe(gulp.dest(basePath));
});

gulp.task('build-js', () => {
    return gulp
        .src('./app/src/main.js')
        .pipe(
            webpack({
                mode: 'development',
                output: {
                    filename: 'script.js',
                },
                watch: false,
                devtool: 'source-map',
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                debug: true,
                                                corejs: 3,
                                                useBuiltIns: 'usage',
                                            },
                                        ],
                                        '@babel/react',
                                    ],
                                },
                            },
                        },
                    ],
                },
            }),
        )
        .pipe(gulp.dest(basePath));
});

gulp.task('build-sass', () => {
    return gulp
        .src('./app/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(basePath));
});

gulp.task('copy-api', () => {
    return gulp.src('./app/api/**/*.*').pipe(gulp.dest(basePath + '/api'));
});

gulp.task('copy-assets', () => {
    return gulp
        .src('./app/assets/**/*.*')
        .pipe(gulp.dest(basePath + '/assets'));
});

gulp.task('watch', () => {
    gulp.watch('./app/src/index.html', gulp.parallel('copy-html'));
    gulp.watch('./app/src/**/*.js', gulp.parallel('build-js'));
    gulp.watch('./app/scss/**/*.scss', gulp.parallel('build-sass'));
    gulp.watch('./app/api/**/*.*', gulp.parallel('copy-api'));
    gulp.watch('./app/assets/**/*.*', gulp.parallel('copy-assets'));
});

gulp.task(
    'build',
    gulp.parallel(
        ('copy-html', 'build-js', 'build-sass', 'copy-api', 'copy-assets'),
    ),
);

gulp.task('default', gulp.parallel('watch', 'build'));