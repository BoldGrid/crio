var BOLDGRID = BOLDGRID || {};
BOLDGRID.COLOR_PALETTE = BOLDGRID.COLOR_PALETTE || {};
BOLDGRID.COLOR_PALETTE.Preview = BOLDGRID.COLOR_PALETTE.Preview || {};

/**
 * Create a preview of palette
 * @param $
 */
( function( $ ) {
	'use strict';

	var self = BOLDGRID.COLOR_PALETTE.Preview;

	// OnLoad.
	$( function() {

		// When the page loads for the first time, this method wont be called.

		// This section of code is executed when the user changes pages in the customizer.
		if ( parent.BOLDGRID && parent.BOLDGRID.COLOR_PALETTE.Modify && parent.BOLDGRID.COLOR_PALETTE.Modify.text_area_val ) {
			self.update_css( parent.BOLDGRID.COLOR_PALETTE.Modify.text_area_val );
		}
	});

	/**
	 * Update CSS overlay colors.
	 *
	 * CSS Overlay colors are translucent background colors
	 * added to elements using PPB. These are currently added using head inline CSS
	 * since the PPB added this feature before we added the --color-x-raw variables.
	 *
	 * This method will update the inline CSS to use the --color-x-raw variables when
	 * the palette is changed. However, in the future, we should update PPB to use
	 * the --color-x-raw variables instead of inline CSS.
	 *
	 * @since 2.20.0
	 */
	self.updateOverlayColors = function() {
		var $bgColorElements = $( '[class*="-background-color"]' );

		$bgColorElements.each( ( _, el ) => {
			var $el       = $( el ),
				alpha     = $el.attr( 'data-alpha' ),
				classList = $el.attr( 'class' ),
				colorIndex,
				colorRaw,
				bgUuid;

			if ( alpha && '1' !== alpha.toString() ) {
				colorIndex = classList.match( /color-?(\d|neutral)-background-color/ )[1];
				bgUuid     = $el.attr( 'data-bg-uuid' );

				colorRaw = '--color-' + colorIndex + '-raw';

				$( `#${bgUuid}-inline-css` ).remove();
				$( 'head' ).append( `<style id="${bgUuid}-inline-css">.${bgUuid} { background-color: rgba( var(${colorRaw}), ${alpha} ) !important; }</style>` );
			}
		} );
	};

	/**
	 * Main responsibility of this file
	 * The to parameter, is a json string that is inside of a textarea in the parent window
	 * along with the compiled css file that is stored in memory in the parent
	 * This function attaches a new css file to the DOM
	 */
	self.update_css = function( to ) {
		var style, data, classes, modify;

		if ( ! to ) {
			return;
		}

		data = JSON.parse( to );
		modify = parent.BOLDGRID.COLOR_PALETTE.Modify;
		classes = _.isArray( modify.body_classes ) ? modify.body_classes.join( ' ' ) : '';

		// Update body class.
		$( 'body:not(.' + data.state['active-palette'] + ')' ).removeClass( classes ).addClass( data.state['active-palette'] );

		// Update styles.
		style = document.getElementById( 'boldgrid-color-palettes-inline-css' );
		if ( style ) {
			style.innerHTML = ':root{' + modify.css_variables + '}';
		} else {
			$( 'head' ).append( '<style id="boldgrid-color-palettes-inline-css" type="text/css">:root{' + modify.css_variables + '}</style>' );
		}
	};

	/**
	 * Everytime the user changes the following setting, Update the css.
	 */
	wp.customize( 'boldgrid_color_palette', function( value ) {
		value.bind( self.update_css );

		// Update css field on updates.
		value.bind( function() {
			parent.BOLDGRID.COLOR_PALETTE.Modify.$compiled_css_control
				.val( parent.BOLDGRID.COLOR_PALETTE.Modify.compiled_css )
				.change();
		} );

		// Update overlay colors.
		self.updateOverlayColors();
	} );

	wp.customize( 'boldgrid_compiled_css', function( value ) {
		value.bind( function() {

			// Update native select element colors.
			BoldGrid.common.forms( true );
		} );
	} );

})( jQuery );
