var BOLDGRID = BOLDGRID || {};
BOLDGRID.Sass = BOLDGRID.Sass || {};

( function( $ ) {
	var self = BOLDGRID.Sass,
		instanceCompiler;

	self.$window = $( window );
	self.compileDone = $.Event( 'boldgrid_sass_compile_done' );
	self.processing = false;

	Sass.setWorkerUrl( BOLDGRIDSass.WorkerUrl );

	instanceCompiler = new Sass( BOLDGRIDSass.WorkerUrl );

	instanceCompiler.writeFile( 'bgtfw/config-files.scss', BOLDGRIDSass.ScssFormatFileContents );

	/**
	 * Setup a compile function
	 */
	self.compile = function( scss, options ) {
		options = options || {};

		self.processing = true;

		/*
		 * var d = new Date();
		 * var start_time  = d.getTime();
		 */

		instanceCompiler.compile( scss, function( result ) {
			var data = {
				result: result,
				source: options.source
			};

			self.processing = false;

			if ( 0 !== result.status ) {
				console.error( result.formatted );
			}

			self.$window.trigger( self.compileDone, data );

			/*
			 * var d = new Date();
			 * var difference  = d.getTime() - start_time;
			 * console.log( difference, " milliseconds" );
			 * console.log( result );
			 * console.log( scss );
			 */
		} );
	};

} )( jQuery );
