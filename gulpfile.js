var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    ngAnnotate  = require('gulp-ng-annotate'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    karma       = require('gulp-karma'),
    del         = require('del'),
    watch       = require('gulp-watch');

gulp.task('default', ['launch']);

// Lint, annotate AngularJS dependencies, and minify JS.
gulp.task('scripts', function() {

	return gulp.src(['./public/app/**/*.module.js', './public/app/**/*.js'])
	    .pipe(jshint())
	    .pipe(jshint.reporter(stylish))
	    .pipe(sourcemaps.init())
	        .pipe(concat('app.min.js', {newLine: ';'}))
	        .pipe(ngAnnotate({add: true}))
	        .pipe(uglify({mangle: true}))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./public/dist/js'))

});

// Concat JS libraries in use.
gulp.task('vendor', function() {

	return gulp.src([
			'./bower_components/firebase/firebase.js',
			'./bower_components/angularfire/dist/angularfire.min.js',
			'./bower_components/angular-animate/angular-animate.min.js',
			'./bower_components/angular-ui-router/release/angular-ui-router.min.js',
			'./bower_components/angular-validation-match/dist/angular-input-match.min.js',
			'./bower_components/angularjs-ordinal-filter/ordinal-browser.js',
			'./bower_components/ng-file-upload/ng-file-upload-all.min.js',
			'./bower_components/ng-imgur/dist/ng-imgur.min.js'
		])
		.pipe(sourcemaps.init())
		    .pipe(concat('vendor.js', {newLine: ';'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/dist/js'))

});

gulp.task('tests', function() {

	return gulp.src('./public/app/**/*.js')
	    .pipe(karma({
	    	configFile: 'karma.conf.js',
	    	action: 'run'
	    }))
	    .on('error', function(err) {
	    	throw err;
	    });

});

// Deletes the public/dist folder.
gulp.task('clean', function(cb) {
	del(['./public/dist'], cb);
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('vendor');
	gulp.start('scripts');
});

gulp.task('watch', function() {
	gulp.watch('./public/app/**/*.js', ['scripts']);
});