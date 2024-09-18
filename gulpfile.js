// Include gulp
const gulp = require('gulp'),
  wpPot = require('gulp-wp-pot'),
  sort = require('gulp-sort'),
  sass = require('gulp-sass')(require('sass')),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  cssnano = require('gulp-cssnano'),
  newer = require('gulp-newer'),
  replace = require('gulp-replace'),
  fontImage = require("googlefonts-sprite-generator"),
  eslint = require('gulp-eslint'),
  phpcs = require('gulp-phpcs'),
  gutil = require('gutil'),
  shell = require('gulp-shell'),
  fs = require('fs'),
  argv = require('yargs').argv,
  modernizr = require('gulp-modernizr'),
  postcss = require('gulp-postcss'),
  inject = require('gulp-inject-string');

// Configs
const config = {
  fontsDest: './crio/inc/boldgrid-theme-framework/assets/fonts',
  src: './src',
  prime_src: './prime',
  prime_dest: './crio',
  dist: './crio/inc/boldgrid-theme-framework',
  node_modules: './node_modules',
  jsDest: './crio/inc/boldgrid-theme-framework/assets/js',
  scss_dest: '../crio/inc/boldgrid-theme-framework/inc/assets/scss',
  scss_src: './inc/assets/scss',
  css_dest: '../crio/inc/boldgrid-theme-framework/inc/assets/css',
  css_src: './inc/assets/css',
  fontsSrc: './inc/assets/fonts',
  img_dest: '../crio/inc/boldgrid-theme-framework/inc/assets/img',
  img_src: './inc/assets/img/**/*',
  layouts_src: './layouts',
  layouts_dest: '../crio/inc/boldgrid-theme-framework/layouts',
  scss_minify: 'compressed'
};

// Create CSS file for font-family control based on webfonts.json.
//
// To avoid misalignment, we need to work off the same list as our googlefonts-image gulp task.
// Before running, make sure assets/json/webfonts.json is up to date with
// https://www.googleapis.com/webfonts/v1/webfonts?key={key-goes-here}
gulp.task('fontFamilyCss', function () {
  const fileContent = fs.readFileSync(config.src + "/assets/json/webfonts.json", "utf8"),
    webFonts = JSON.parse(fileContent),
    outFilename = 'font-family-controls.min.css';
  let css = '',
    family,
    position;

  for (let key in webFonts.items) {
    family = webFonts.items[key].family;
    position = key * -41.423841059602649006622516556291;

    css += '.select2-container--default .select2-selection__rendered[title="' + family + '"] {color: transparent; background-image: url(../../img/web-fonts.png); background-repeat: no-repeat; background-position: 8px ' + position + 'px;}';
    css += '[id^="select2-"][id$="-' + family + '"] { line-height:25px; color: transparent; background-image: url(../../img/web-fonts.png); background-repeat: no-repeat; background-position:8px ' + position + 'px;}';
    css += '[id^="select2-"][id$="-' + family + '"]:hover, [id^="select2-"][id$="-' + family + '"].select2-results__option--highlighted[aria-selected] { color: transparent; }';
  }

  // Write to file.
  fs.writeFileSync(outFilename, css);
  return gulp.src(outFilename)
    .pipe(clean(config.dist + '/assets/css/customizer/' + outFilename))
    .pipe(gulp.dest(config.dist + '/assets/css/customizer'));
});

// Google Fonts image generator
//
// Troubleshooting:
// # Within node_modules/googlefonts-sprint-generator/app.js use dnodeOpts: {weak: false}, as shown
//   here: https://pastebin.com/uZGZP5Ms
// # Preview the image used within sprites by visiting the following page:
//   node_modules/googlefonts-sprint-generator/generators/generator_phantom.html
gulp.task('googlefonts-image', function () {
  const googleApiKey = argv.google_api_key;
  if (!googleApiKey) {
	console.log('Invalid format' );
    console.log('gulp googlefonts-image --google_api_key={Key Goes Here}');
    return;
  }

  fontImage.getImage({
    callback: function (base64Data) {
      fs.writeFile(config.src + '/assets/img/web-fonts.png', base64Data, 'base64', function (err) {
        console.log(err);
      });
    },
    port: 1224,
    options: {
      lineHeight: '37px',
      fontSize: '25px',
      width: '500px'
    },
    googleAPIKey: googleApiKey
  });

  return 1;
});

// Create dist folder.
gulp.task('dist', function () {
  return gulp.src('*.*', {read: false})
    .pipe(gulp.dest('./crio/inc/boldgrid-theme-framework'))
});

// Javascript Dependencies
gulp.task('jsDeps', function () {
  gulp.src(config.node_modules + '/multislider/src/*.js' )
    .pipe(gulp.dest(config.jsDest + '/multislider' ) );
  // jQuery Stellar - Check
  gulp.src(config.node_modules + '/jquery.stellar/jquery.stellar*.js')
    .pipe(gulp.dest(config.jsDest + '/jquery-stellar'));
  gulp.src(config.node_modules + '/jquery.stellar/jquery.stellar*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.jsDest + '/jquery-stellar'));
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
  // float-labels.js
  gulp.src(config.node_modules + '/float-labels.js/dist/float-labels.min.js')
    .pipe(gulp.dest(config.jsDest + '/float-labels.js'));
  gulp.src(config.node_modules + '/float-labels.js/src/float-labels.js')
    .pipe(gulp.dest(config.jsDest + '/float-labels.js'));
  // Wowjs - Check
  gulp.src([
	'!' + config.node_modules + '/wow.js/dist/**/*.map',
	config.node_modules + '/wow.js/dist/**/*'
	]).pipe(gulp.dest(config.jsDest + '/wow'));
  // Color-js
  gulp.src(config.node_modules + '/color-js/color.js')
    .pipe(gulp.dest(config.jsDest + '/color-js'));
  gulp.src(config.node_modules + '/color-js/color.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.jsDest + '/color-js'));
});

// Font Dependencies
gulp.task('fontDeps', function () {
  // Font Awesome
  gulp.src(config.node_modules + '/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,otf,svg}')
    .pipe(gulp.dest(config.fontsDest));
  // .pipe( notify( { message: 'Font Dependencies Loaded', onLast: true } ) );
  // Custom Icons
  gulp.src(config.src + '/assets/fonts/*.{ttf,woff,woff2,eot,otf,svg}')
    .pipe(gulp.dest(config.fontsDest));
});

// PHP Dependencies
gulp.task('phpDeps', function () {
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
	'!' + config.node_modules + '/kirki-toolkit/modules/webfonts/*.json',
    config.node_modules + '/kirki-toolkit/**',
  ])
    .pipe(replace('kirki-logo.svg', 'boldgrid-logo.svg'))
    // Use locally provided FontAwesome dependency.
    .pipe(replace(/([ \t]*)wp_enqueue_script\(\s?\'kirki-fontawesome-font\',\s?\'https:\/\/use.fontawesome.com\/30858dc40a.js\',\s?array\(\),\s?\'4.0.7\',\s?(?:true|false)\s?\)\;\s?^(?:[\t ]*(?:\r?\n|\r))*/gm, "$1global $boldgrid_theme_framework;\n$1$bgtfw_configs = $boldgrid_theme_framework->get_configs();\n\n$1if ( ! class_exists( 'BoldGrid_Framework_Styles' ) ) {\n$1\trequire_once $bgtfw_configs['framework']['includes_dir'] . 'class-boldgrid-framework-styles.php';\n$1}\n\n$1$bgtfw_styles = new BoldGrid_Framework_Styles( $bgtfw_configs );\n$1$bgtfw_styles->enqueue_fontawesome();\n\n"))
	.pipe( replace(/.*sourceMappingURL=.*\n/g, '') )
  // Change 'final private' methods to 'private'.
  .pipe( replace( /final private function/g, 'private function' ) )
	.pipe(gulp.dest(config.dist + '/includes/kirki') );
  // Get Kirki CSS.
  gulp.src(config.node_modules + '/kirki-toolkit/assets/**/*.{css,json}')
    .pipe(replace('Button styles **/', 'Button styles **', true))
	.pipe( replace(/.*sourceMappingURL=.*\n/g, '') )
    .pipe(gulp.dest(config.dist + '/includes/kirki/assets'));
  // Get Kirki Assets.
  gulp.src(config.node_modules + '/kirki-toolkit/assets/**/*.{png,scss,js,json}')
    .pipe(gulp.dest(config.dist + '/includes/kirki/assets'));
  gulp.src(config.src + "/assets/json/webfonts.json")
    .pipe(gulp.dest(config.dist + '/includes/kirki/assets/json'));
  gulp.src(config.src + "/assets/json/kirki-modules-webfonts/*.json*")
    .pipe(gulp.dest(config.dist + '/includes/kirki/modules/webfonts' ) );
  // Add BoldGrid Logo to Kirki.
  gulp.src(config.src + '/assets/img/boldgrid-logo.svg')
    .pipe(gulp.dest(config.dist + '/includes/kirki/assets/images'));
});

// Copy Framework Files.
gulp.task('frameworkFiles', function () {
  return gulp.src([
    config.src + '/**/*.{php,txt,json,css,mo,po,pot}',
  ])
    .pipe(gulp.dest(config.dist));
});

// Move Readme.txt to build folder.
gulp.task( 'readme', function() {
  return gulp.src('./readme.txt')
    .pipe(gulp.dest(config.prime_dest));
} );

// Move style.css to build folder.
gulp.task( 'styleCss', function() {
  return gulp.src('./style.css')
    .pipe(gulp.dest(config.prime_dest));
} );

// Copy License
gulp.task( 'license', function() {
	return gulp.src('./LICENSE')
    .pipe(gulp.dest(config.dist));
} );

// Framework Images.  Pipe through newer images only!
gulp.task('images', function () {
  return gulp.src([config.src + '/assets/img/**/*.{png,jpg,gif}'])
    .pipe(newer(config.dist + '/assets/img'))
    //.pipe( changed( config.src + '/assets/img' ) )
    .pipe(gulp.dest(config.dist + '/assets/img'))
});

// Move src svgs to dist.
gulp.task('svgs', function() {
  return gulp.src([config.src + '/assets/img/**/*.svg'])
    .pipe(gulp.dest(config.dist + '/assets/img'))
});

// Setup Translate.
gulp.task( 'translate', function() {
  return gulp.src( config.prime_dest + '/**/*.php' )
    .pipe( sort() )
    .pipe( wpPot( {
      domain: 'crio',
      destFile: 'crio.pot',
      package: 'crio',
      bugReport: 'https://boldgrid.com',
      team: 'The BoldGrid Team <support@boldgrid.com>'
    } ) )
    .pipe( gulp.dest( config.prime_dest + '/languages' ) );
  //.pipe( notify( { message: 'Theme Translation complete', onLast: true } ) );
});

gulp.task('jscs', function () {
	return gulp.src([config.src + '/assets/js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format()) // Output results to the console
    .pipe(eslint.failAfterError()); // Fail the task if an error is found
});

// Minify & Copy JS
gulp.task('frameworkJs', function () {
  // Minified Files.
  gulp.src([config.src + '/assets/js/**/*.js'])
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.dist + '/assets/js'));

  // Unminified Files.
  gulp.src([config.src + '/assets/js/**/*.js'])
    .pipe(gulp.dest(config.dist + '/assets/js'));
});

// Modernizr
// Minify & Copy JS
gulp.task('modernizr', function () {
  // Minified Files.
  gulp.src([
	  config.src + '/assets/js/**/*.js',
    '!' + config.src + '/assets/js/customizer/customizer.js',
    '!' + config.src + '/assets/js/customizer/base-customizer.js',
	])
    .pipe(modernizr(require('./modernizr-config.json')))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify({
      mangle: {
        reserved: ['Modernizr']
      }
    }).on('error', gutil.log))
    .pipe(gulp.dest(config.dist + '/assets/js'));

  // Unminified Files.
  gulp.src([config.src + '/assets/js/**/*.js'])
    .pipe(modernizr(require('./modernizr-config.json')))
    .pipe(gulp.dest(config.dist + '/assets/js'));

	if ( 'development' !== process.env.NODE_ENV ) {
		gulp.start('webpack');
	}
});

// Copy SCSS & CSS deps.
gulp.task('scssDeps', function () {
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
	.pipe(replace("font-family: 'FontAwesome';", "font-family: 'FontAwesome';font-display:swap;"))
    .pipe(gulp.dest(config.dist + '/assets/scss/font-awesome'));
  // Custom Icons
  gulp.src(config.scss_src + '/icomoon/style.scss')
    .pipe(gulp.dest(config.dist + '/assets/scss/icomoon'));
  // Container Widths
  gulp.src(config.scss_src + '/container-widths.scss')
    .pipe(gulp.dest(config.dist + '/assets/scss/container-widths'));
  // Animate.css
  gulp.src(config.node_modules + '/animate.css/animate.*')
    .pipe(gulp.dest(config.dist + '/assets/css/animate-css'));
  // Underscores
  gulp.src(config.node_modules + '/Buttons/scss/**/*.scss')
    .pipe(replace('$values: #{$values}, #{$i}px #{$i}px #{$kolor};', "$values: unquote(#{$values}+', '+#{$i}+'px '+#{$i}+'px '+#{$kolor});"))
    .pipe(replace("$values: #{$values}, unquote($i * -1 + 'px') #{$i}px #{$kolor};", "$values: unquote(#{$values}+', '+#{$i * -1}+'px '+#{$i}+'px '+#{$kolor});"))
    .pipe(replace("background: linear-gradient(top,", "background: linear-gradient("))
    .pipe(gulp.dest(config.dist + '/assets/scss/buttons'));

  // boldgrid-components.
  gulp.src('./node_modules/@boldgrid/components/dist/css/components.*')
    .pipe(gulp.dest(config.dist + '/assets/css'));

  // hamburgers.
  gulp.src(config.node_modules + '/hamburgers/dist/*.css')
    .pipe(gulp.dest(config.dist + '/assets/css/hamburgers'));
  // forms.
  gulp.src(config.node_modules + '/float-labels.js/src/float-labels.scss')
    .pipe(gulp.dest(config.dist + '/assets/scss/float-labels.js'));
});

// Compile SCSS
gulp.task('scssCompile', function () {
  const plugins = [
    require('postcss-flexbugs-fixes'),
    require('autoprefixer')
  ];
  return gulp.src([
    '!' + config.dist + '/assets/scss/bootstrap.scss',
    '!' + config.dist + '/assets/scss/custom-color/**/*',
    '!' + config.dist + '/assets/scss/container-widths.scss',
    config.dist + '/assets/scss/**/*.scss'
  ])
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: [
        config.dist + 'assets/scss/',
        config.dist + 'assets/scss/bootstrap'
      ]
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(config.dist + '/assets/css'))
    .pipe(cssnano({
      safe: true,
      discardComments: { removeAll: true },
      zindex: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dist + '/assets/css'));
});

// Bootstrap Compile
gulp.task('bootstrapCompile', function () {
  gulp.src(config.dist + '/assets/scss/bootstrap.scss')
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(config.dist + '/assets/css/bootstrap'))
    .pipe(cssnano({ discardComments: { removeAll: true }, safe: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dist + '/assets/css/bootstrap'))
  //  .pipe( notify( { message: 'SCSS compile complete', onLast: true } ) );
});

// Bootstrap Compile
gulp.task('colorPalettesCompile', function () {
  gulp.src(config.dist + '/assets/scss/custom-color/color-palettes.scss')
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(config.prime_dest + '/css' ) )
    .pipe(cssnano({ discardComments: { removeAll: true }, safe: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest( config.prime_dest + '/css' ) )
  //  .pipe( notify( { message: 'SCSS compile complete', onLast: true } ) );
});

// Watch for changes and recompile SCSS
gulp.task('sass:watch', function () {
  gulp.watch('src/assets/scss/**/*.scss', gulp.series('copyScss', 'scssCompile'));
});

// Watch for changes and copy PHP files
gulp.task('php:watch', function () {
  gulp.watch(config.src + '/**/*.{php,txt,json,css,mo,po,pot}', gulp.series('frameworkFiles'));
});

// Watch for changes and recompile/copy JS files
gulp.task('js:watch', function () {
  gulp.watch(config.src + '/**/*.js', gulp.series('framework-js'));
});

gulp.task( 'copyScss', () => {
	return gulp.src( config.src + '/assets/scss/**/*.scss' )
		.pipe( gulp.dest( config.dist + '/assets/scss/' ) );
} );

// PHP Code Sniffer
gulp.task('codeSniffer', function () {
  return gulp.src([
    'src/**/*.php'
  ])
    // Validate files using PHP Code Sniffer
    .pipe(phpcs({
      standard: 'WordPress',
      warningSeverity: 0
    }))
    // Log all problems that was found
    .pipe(phpcs.reporter('log'));
});

// hovers.
gulp.task('hovers', function() {
  var plugins = [
    require('postcss-hash-classname')({
      hashType: 'md5',
      digestType: 'base32',
      maxLength: 0,
      outputName: 'hover1',
      classnameFormat: '[classname] > a:not( .button-primary):not( .button-secondary )',
      type: '.json'
    })
  ];
  gulp.src(config.node_modules + '/hover.css/css/hover*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest(config.dist + '/assets/css/hover.css'));
});

gulp.task('hoverColors', function() {
  var plugins = [
    require('postcss-colors-only')({
      withoutGrey: false, // set to true to remove rules that only have grey colors
      withoutMonochrome: false, // set to true to remove rules that only have grey, black, or white colors
      inverse: false, // set to true to remove colors from rules
    }),
    require('postcss-hash-classname')({
      hashType: 'md5',
      digestType: 'base32',
      maxLength: 0,
      outputName: 'hover2',
      classnameFormat: '[classname]:not( .button-primary):not( .button-secondary ) > a',
      type: '.json'
    }),
    require('postcss-prefix-selector')({ prefix: '%1$s' })
  ];
  return gulp.src(config.node_modules + '/hover.css/css/hover.css')
      .pipe(cssnano({
        safe: true,
        discardComments: { removeAll: true }}))
      .pipe(postcss(plugins))
      .pipe(replace('#fff', '%2$s'))
      .pipe(replace('#2098d1', '%3$s'))
      .pipe(replace('#e1e1e1', '%4$s'))
      .pipe(inject.wrap('<?php \nreturn \'', '\';'))
      .pipe(rename({
        suffix: '-colors-only',
        extname: '.php'
      }))
      .pipe(gulp.dest(config.dist + '/includes/partials'));
});

gulp.task('cleanHovers', function() {
  return gulp.src('hover*.json')
    .pipe(clean({force: true}));
});

gulp.task( 'patterns', shell.task( 'yarn run script:patterns' ) );
gulp.task( 'tgm', shell.task( 'yarn run script:tgm' ) );
gulp.task( 'wpTextDomainLint', shell.task( 'yarn run script:wp-textdomain-lint' ) );

gulp.task( 'prime', function() {
  return gulp.src([
    config.prime_src + '/**/*',
  ])
    .pipe(gulp.dest(config.prime_dest));
} );

// Build Task
gulp.task('build', gulp.series(
  'dist',
  'prime',
  gulp.parallel('readme', 'license', 'styleCss'),
  gulp.parallel( 'jscs', 'frameworkJs', 'svgs', 'tgm'),
  gulp.parallel('scssDeps', 'jsDeps', 'modernizr', 'fontDeps', 'phpDeps', 'frameworkFiles', 'copyScss'),
  'images',
  gulp.parallel('scssCompile', 'bootstrapCompile', 'colorPalettesCompile'),
  gulp.parallel('fontFamilyCss', 'patterns'),
  'hovers',
  'hoverColors',
  'cleanHovers',
  'wpTextDomainLint',
  'translate'
));

// Quick Build Task
gulp.task('qbuild', gulp.series(
  'dist',
  gulp.parallel('readme', 'license', 'styleCss'),
  gulp.parallel('wpTextDomainLint', 'jscs', 'frameworkJs'),
  gulp.parallel('scssDeps', 'jsDeps', 'modernizr', 'fontDeps', 'phpDeps', 'frameworkFiles', 'copyScss'),
  gulp.parallel('scssCompile', 'bootstrapCompile'),
  'fontFamilyCss',
  'hovers',
  'hoverColors',
  'cleanHovers'
));

// Watch Task
gulp.task('watch', gulp.parallel('sass:watch', 'php:watch', 'js:watch'));
