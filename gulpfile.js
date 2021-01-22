var gulp    = require('gulp'),
	replace = require('gulp-replace'),
	shell   = require('gulp-shell');

var config = {
	fontsDest: './inc/boldgrid-theme-framework/assets/fonts',
	src: './src/inc/boldgrid-theme-framework',
	dist: './inc/boldgrid-theme-framework',
	node_modules: './node_modules',
	jsDest: './inc/boldgrid-theme-framework/assets/js',
	scss_dest: '../inc/boldgrid-theme-framework/inc/assets/scss',
	scss_src: './src/inc/boldgrid-theme-framework/assets/scss',
	css_dest: '../inc/boldgrid-theme-framework/inc/assets/css',
	css_src: './src/inc/boldgrid-theme-framework/assets/css',
	fontsSrc: './src/inc/boldgrid-theme-framework/assets/fonts',
	img_dest: '../inc/boldgrid-theme-framework/inc/assets/img',
	img_src: './src/inc/boldgrid-theme-framework/assets/img/**/*',
	scss_minify: 'compressed' // or uncompressed for dev
};

// Copies CSS and SCSS Dependancies.
gulp.task('copyCssScssDeps', (cb) => {
	// Bootstrap
	gulp.src(config.node_modules + '/bootstrap-sass/assets/stylesheets/**/*')
		.pipe(replace(/@import "bootstrap\/buttons";/, '//@import "bootstrap/buttons";'))
		.pipe(replace(/@import "bootstrap\/forms";/, '//@import "bootstrap/forms";'))
		.pipe(replace(/@import "bootstrap\/navbar";/, '//@import "bootstrap/navbar";'))
		.pipe(replace(/@import "bootstrap\/button-groups";/, '//@import "bootstrap/button-groups";'))
		.pipe(replace(/@import "bootstrap\/glyphicons";/, '//@import "bootstrap/glyphicons";'))
		.pipe(gulp.dest(config.dist + '/assets/scss/bootstrap'));
	// Font-Awesome
	gulp.src(config.node_modules + '/font-awesome/scss/**/*.scss')
		.pipe(replace('../fonts', '../../fonts'))
		.pipe(gulp.dest(config.dist + '/assets/scss/font-awesome'));
	// Custom Icons
	gulp.src(config.scss_src + '/icomoon/style.scss')
		.pipe(gulp.dest(config.dist + '/assets/scss/icomoon'));
	// Animate.css
	gulp.src(config.node_modules + '/animate.css/animate.*')
		.pipe(gulp.dest(config.dist + '/assets/css/animate-css'));
	// Underscores
	gulp.src(config.scss_src + '/buttons/**/*.scss')
		.pipe(replace('$values: #{$values}, #{$i}px #{$i}px #{$kolor};', "$values: unquote(#{$values}+', '+#{$i}+'px '+#{$i}+'px '+#{$kolor});"))
		.pipe(replace("$values: #{$values}, unquote($i * -1 + 'px') #{$i}px #{$kolor};", "$values: unquote(#{$values}+', '+#{$i * -1}+'px '+#{$i}+'px '+#{$kolor});"))
		.pipe(replace("background: linear-gradient(top,", "background: linear-gradient("))
		.pipe(gulp.dest(config.dist + '/assets/scss/buttons'));

	gulp.src(config.node_modules + '/smartmenus/dist/css/sm-core-css.css')
		.pipe(gulp.dest(config.dist + '/assets/css/smartmenus'));

	// boldgrid-components.
	gulp.src(config.node_modules + '/@boldgrid/components/dist/css/components.*')
		.pipe(gulp.dest(config.dist + '/assets/css'));

	// hamburgers.
	gulp.src(config.css_src + '/hamburgers/*.css')
		.pipe(gulp.dest(config.dist + '/assets/css/hamburgers'));
	// forms.
	gulp.src(config.scss_src + '/float-labels.js/float-labels.scss')
		.pipe(gulp.dest(config.dist + '/assets/scss/float-labels.js'));
	cb();
});

// Copy JS Dependancies
gulp.task('copyJsDeps', (cb) => {
	// Bootstrap
		gulp.src(config.node_modules + '/bootstrap-sass/assets/javascripts/bootstrap.*')
			.pipe(gulp.dest(config.jsDest + '/bootstrap'));
		gulp.src(config.node_modules + '/smartmenus/dist/jquery.*.js')
			.pipe(gulp.dest(config.jsDest + '/smartmenus'));
	// Nicescroll.
		gulp.src(config.node_modules + '/jquery.nicescroll/dist/*.{js,png}')
			.pipe(gulp.dest(config.jsDest + '/niceScroll'));
	// jQuery goup.
		gulp.src([
			config.node_modules + '/jquery-goup/src/*.js',
			config.node_modules + '/jquery-goup/*.js'])
			.pipe(gulp.dest(config.jsDest + '/goup'));
	// sass.js - Check
		gulp.src(config.node_modules + '/sass.js/dist/**/*')
			.pipe(gulp.dest(config.jsDest + '/sass-js'));
	// float-labels.js NOTE: Flagged for future removal / integration.
		gulp.src(config.node_modules + '/float-labels.js/dist/float-labels.min.js')
			.pipe(gulp.dest(config.jsDest + '/float-labels.js'));
		gulp.src(config.node_modules + '/float-labels.js/src/float-labels.js')
			.pipe(gulp.dest(config.jsDest + '/float-labels.js'));
	// Wowjs - Check NOTE: Deprecated - Need to replace with aos ( animate on scroll )
		gulp.src([
			config.node_modules + '/wow.js/dist/**/*.js'
			]).pipe(gulp.dest(config.jsDest + '/wow'));
	// Color-js NOTE: Flagged for future removal / integration
		gulp.src(config.node_modules + '/color-js/color.js')
			.pipe(gulp.dest(config.jsDest + '/color-js'));
		cb();
});

// Copy Kirki and ScssPHP dependancies
gulp.task('copyKirkiScssPhp', (cb) => {
	// ScssPhp SCSSPHP Compiler
		gulp.src([
			'!' + config.node_modules + '/scssphp/tests',
			'!' + config.node_modules + '/scssphp/example/**',
			'!' + config.node_modules + '/scssphp/tests/**',
			config.node_modules + '/scssphp/**/*.php'
		]).pipe(gulp.dest(config.dist + '/includes/scssphp'));
	// Kirki Customizer Controls.
		gulp.src([
			'!' + config.node_modules + '/kirki-toolkit/assets',
			'!' + config.node_modules + '/kirki-toolkit/assets/**',
			'!' + config.node_modules + '/kirki-toolkit/tests',
			'!' + config.node_modules + '/kirki-toolkit/tests/**',
			'!' + config.node_modules + '/kirki-toolkit/docs',
			'!' + config.node_modules + '/kirki-toolkit/docs/**',
			'!' + config.node_modules + '/kirki-toolkit/**/*.map',
			'!' + config.node_modules + '/kirki-toolkit/**/*build.sh',
			'!' + config.node_modules + '/kirki-toolkit/**/*phpunit**',
			config.node_modules + '/kirki-toolkit/**',
		])
			.pipe(replace('kirki-logo.svg', 'boldgrid-logo.svg'))
			// Use locally provided FontAwesome dependency.
			.pipe(replace(/([ \t]*)wp_enqueue_script\(\s?\'kirki-fontawesome-font\',\s?\'https:\/\/use.fontawesome.com\/30858dc40a.js\',\s?array\(\),\s?\'4.0.7\',\s?(?:true|false)\s?\)\;\s?^(?:[\t ]*(?:\r?\n|\r))*/gm, "$1global $boldgrid_theme_framework;\n$1$bgtfw_configs = $boldgrid_theme_framework->get_configs();\n\n$1if ( ! class_exists( 'BoldGrid_Framework_Styles' ) ) {\n$1\trequire_once $bgtfw_configs['framework']['includes_dir'] . 'class-boldgrid-framework-styles.php';\n$1}\n\n$1$bgtfw_styles = new BoldGrid_Framework_Styles( $bgtfw_configs );\n$1$bgtfw_styles->enqueue_fontawesome();\n\n"))
			.pipe(gulp.dest(config.dist + '/includes/kirki'));
	// Get Kirki CSS.
		gulp.src(config.node_modules + '/kirki-toolkit/assets/**/*.{css,json}')
			.pipe(replace('Button styles **/', 'Button styles **'))
			.pipe(gulp.dest(config.dist + '/includes/kirki/assets'));
	// Get Kirki Assets.
		gulp.src(config.node_modules + '/kirki-toolkit/assets/**/*.{png,scss,js,json}')
			.pipe(gulp.dest(config.dist + '/includes/kirki/assets'));
		gulp.src(config.src + "/assets/json/webfonts.json")
			.pipe(gulp.dest(config.dist + '/includes/kirki/assets/json'));
	// Add BoldGrid Logo to Kirki.
		gulp.src(config.src + '/assets/img/boldgrid-logo.svg')
			.pipe(gulp.dest(config.dist + '/includes/kirki/assets/images'));
		cb();
});

// Create the destination directory for build files.
gulp.task('createDistDir', (cb) => {
	gulp.src('*.*', { read: false } ).pipe( gulp.dest( './inc/boldgrid-theme-framework' ) );
	cb();
} );

// Install TGM Plugin Activation Library.
gulp.task('tgm', shell.task( 'yarn run script:tgm' ) );

// Run webpack build process.
gulp.task( 'webpack', shell.task('npm run build-webpack') );

// Buld Task.
gulp.task( 'build',
	gulp.series(
		'createDistDir',
		'tgm',
		gulp.parallel(
			'copyCssScssDeps',
			'copyJsDeps',
			'copyKirkiScssPhp'
		),
		'webpack'
	)
);

// [ 'readme','license' ],
// ['wpTextDomainLint', 'jsHint', 'jscs', 'frameworkJs'],
// ['scssDeps', 'jsDeps', 'modernizr', 'fontDeps', 'phpDeps', 'frameworkFiles', 'copyScss'],
// ['scssCompile', 'bootstrapCompile'],
// 'fontFamilyCss',
// 'hovers',
// 'hoverColors',
// 'cleanHovers',