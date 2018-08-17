const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');

const nkPadAdaptive = require('./dist/index.js').default;

const files = ['src/**/*.js'];
const watchFiles = ['index.js'];

gulp.task('babel', function() {
	return gulp
        .src(files)
		.pipe(babel())
		.pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
	return gulp
		.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// gulp.task('test', function() {
// 	return gulp
// 		.src('test/*.js', { read: false })
// 		.pipe(mocha({ timeout: 1000000 }));
// });

gulp.task('css', function() {
	return gulp
		.src('./test/src/css/**/*.css')
		.pipe(
			postcss([nkPadAdaptive({

            })])
		)
		.pipe(gulp.dest('./test/dist/css'));
});

gulp.task('watch:babel', function() {
	gulp.watch(files, ['babel']);
});

gulp.task('watch:css', function() {
	gulp.watch('./test/src/css/**/*.css', ['css']);
});
