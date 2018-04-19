import babelify   from 'babelify';
import browserify from 'browserify';
import buffer    from 'vinyl-buffer';
import del      from 'del';
import gulp      from 'gulp';
import gulpif    from 'gulp-if';
import source    from 'vinyl-source-stream';
import uglify    from 'gulp-uglify';
import util      from 'gulp-util';
import sass      from 'gulp-sass';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

const reload = browserSync.reload;

const config = {
	filename: 'main',
	scripts: {
		input: ['./src/assets/scripts/main.js'],
		out: './dist/scripts/',
		watch: ['./src/**/*.js']
	},
	styles: {
		input: ['./src/assets/styles/main.scss'],
		out: './dist/styles/',
		watch: ['./src/**/*.scss']
	},
	images: {
		input: './src/assets/images/**/*',
		out: './dist/images/',
		watch: './src/assets/images/**/*'
	},

	isDev : util.env.dev // Config is dev if the dev flag is passed (gulp --dev)
};

/**
 * Deletes the /dist/ folder
 */
gulp.task('clean', () => {
	del.sync(config.scripts.out);
	del.sync(config.styles.out);
	del.sync(config.images.out);
});


/**
 * Builds all of our scripts
 */
gulp.task('scripts', () => {
	// console.log(CONFIG)

	const entries = config.scripts.input;

	entries.map( (entry) => {
		// Browserfy Object
		const bundler = browserify({
			entries: entry,
			debug: config.isDev
		});

		// Transform through Babel
		bundler.transform( 'babelify', {
			presets: ['es2015']
		});

		return bundler.bundle().on('error', (err) => {
			console.error(err);
			this.emit('end');
		})
		// Convert Stream to buffer
		.pipe(source(config.filename + '.js'))
		.pipe(buffer())
		// if not dev, uglify the code
		.pipe(gulpif(!config.isDev, uglify()))
		.pipe(gulp.dest(config.scripts.out))
		.pipe(reload({stream:true}));
	});
});

// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', () => {
	return gulp.src(config.styles.input)
    .pipe(sass({
    	outputStyle: 'compressed',
    	errLogToConsole: true
    }).on('error', sass.logError))
   	.pipe(autoprefixer())
    .pipe(gulp.dest(config.styles.out))
    .pipe(reload({stream:true}));
});

// copys over images to dist
gulp.task('images', (done) => {
	return gulp.src(config.images.input)
		.pipe(gulp.dest(config.images.out))
		.pipe(gulpif(config.dev, reload({ stream: true })));
});

/**
 * Our Default task gets executed when calling gulp.
 */
gulp.task('default', ['clean'], () => {
	gulp.start('watch');
});

/**
 *  This sets up the server
 */
gulp.task('browser-sync', () => {
	//watch files
	const files = [
		'./src/**/*',
		'./*.html'
	];

	//initialize browsersync
	browserSync.init(files,{
      server: {
          baseDir: "./"
      }
  });
});

/**
 * Watches for changes and calls the correct task
 */
gulp.task('watch', ['scripts', 'sass', 'images', 'browser-sync'], () => {
	gulp.watch(config.scripts.watch, ['scripts']);
	gulp.watch('src/**/*.scss', ['sass']);
	gulp.watch('src/assets/images/**/*', ['images']);
});
