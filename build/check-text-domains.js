const textdomain = require( './modules/wp-textdomain-lint.js' );

textdomain( 'src/**/*.php', {
	domain: [ 'crio' ],
	fix: true,
	force: false
} );

textdomain( 'prime/**/*.php', {
	domain: [ 'crio' ],
	fix: true,
	force: false
} );

textdomain( 'crio/inc/boldgrid-theme-framework/**/*.php', {
	domain: [ 'crio' ],
	fix: true,
	force: false
} );
