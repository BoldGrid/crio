var copyFiles    = [];
const glob       = require( 'glob' );
const path       = require( 'path' );
const src        = path.resolve( 'src/inc/boldgrid-theme-framework' );
const jsPath     = path.resolve( 'src/inc/boldgrid-theme-framework/assets/js' );
const CopyPlugin = require( 'copy-webpack-plugin' );

const entryFiles = glob.sync( path.resolve( 'src/inc/boldgrid-theme-framework/assets/js/**/*.js' ) ).reduce( ( previousValue, currentValue, currentIndex, array ) => {
	if ( 'string' === typeof previousValue ) {
		copyFiles.push( { from: previousValue, to: previousValue.replace( 'src', 'crio' ) } );
		return {
			[previousValue.replace( jsPath + '/', '' ).replace( '.js', '' )]: previousValue.replace( src, '.' ),
			[currentValue.replace( jsPath + '/', '' ).replace( '.js', '' )]: currentValue.replace( src, '.' )
		};
	} else {
		copyFiles.push( { from: currentValue, to: currentValue.replace( 'src', 'crio' ) } );
		return { ...previousValue, [currentValue.replace( jsPath + '/', '' ).replace( '.js', '' )]: currentValue.replace( src, '.' ) };
	}
} );

module.exports = {
	'entry': entryFiles,
	'output': {
		'chunkFilename': 'assets/js/[id].chunk.js',
		'filename': './assets/js/[name].min.js'
	},
	'externals': {
		'jquery': 'jQuery'
	},
	'devtool': false,
	'stats': {
		'assets': true,
		'children': false,
		'chunks': true,
		'hash': false,
		'modules': true,
		'publicPath': true,
		'timings': true,
		'version': true,
		'warnings': true,
		'colors': {
			'green': '\u001b[32m'
		}
	},
	'plugins': [
		new CopyPlugin( {
			patterns: copyFiles,
			options: {
				concurrency: 100
			}
		} )
	]
};
