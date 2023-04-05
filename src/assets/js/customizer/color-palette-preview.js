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
		var $bgColorElements    = $( '[class*="-background-color"]' ),
			$imgOverlayElements = $( '[data-bg-overlaycolor-class]' ),
			$fwrElements        = $( '[class*="fwr-"]' ),
			rawColorValues      = {
				'color-1-raw': $( ':root' ).css( '--color-1-raw' ),
				'color-2-raw': $( ':root' ).css( '--color-2-raw' ),
				'color-3-raw': $( ':root' ).css( '--color-3-raw' ),
				'color-4-raw': $( ':root' ).css( '--color-4-raw' ),
				'color-5-raw': $( ':root' ).css( '--color-5-raw' ),
				'color-neutral-raw': $( ':root' ).css( '--color-neutral-raw' ),
			};

		$bgColorElements.each( ( _, el ) => {
			var $bgColorEl      = $( el ),
				bgUuid          = $bgColorEl.attr( 'data-bg-uuid' ),
				$fwrInlineStyle = $( `#${bgUuid}-inline-css` );

			$fwrInlineStyle.each( ( _, el ) => {
				self.updateBgColorOverlays( el, rawColorValues );
			} );
		} );

		$imgOverlayElements.each( ( _, el ) => {
			self.updateImageOverlays( el, rawColorValues );
		} );

		$fwrElements.each( ( _, el ) => {
			var $fwr            = $( el ),
				classList       = $fwr.attr( 'class' ),
				fwrId           = 'fwr-' + classList.match( /fwr-?(\d+)/ )[1],
				$fwrInlineStyle = $( `#${fwrId}-inline-css` );

			$fwrInlineStyle.each( ( _, el ) => {
				self.updateBgColorOverlays( el, rawColorValues );
			} );
		} );
	};

	/**
	 * Updage Image Overlay colors.
	 *
	 * Elements that have a translucent color overlaying the
	 * background image that uses a color from the palette,
	 * has the background-image property set in the elements'
	 * inline styles.
	 *
	 * @since 2.20.0
	 *
	 * @param {object} el             Image overlay element.
	 * @param {object} rawColorValues Raw color values.
	 */
	self.updateImageOverlays = function( el, rawColorValues ) {
		var $el             = $( el ),
			elStyle         = $el.attr( 'style' ),
			colorIndex      = $el.attr( 'data-bg-overlaycolor-class' ),
			overlayValue    = rawColorValues[`color-${colorIndex}-raw`],
			overlayVariable = `var(--color-${colorIndex}-raw)`,
			colorMatches    = elStyle.match( new RegExp( overlayValue, 'g' ) );

		// If the color value is not found, try removing the spaces.
		if ( ! colorMatches ) {
			overlayValue = overlayValue.replace( /\s/g, '' );
			colorMatches = elStyle.match( new RegExp( overlayValue, 'g' ) );
		}

		$el.attr(
			'style',
			elStyle.replace( new RegExp( overlayValue, 'g' ), overlayVariable )
		);
	};


	/**
	 * Update BG Color Overlays.
	 *
	 * Elements with a translucent background color
	 * that uses a color from the palette, and does not
	 * have a background image, has the background properties
	 * set in the <head> inline style element. This handles
	 * Full Width Rows as well.
	 *
	 * @since 2.20.0
	 *
	 * @param {object} inlineStyleEl  <head> inline style element.
	 * @param {object} rawColorValues Raw color values.
	 */
	self.updateBgColorOverlays = function( inlineStyleEl, rawColorValues ) {
		var $inlineStyleEl = $( inlineStyleEl ),
			styleString    = $inlineStyleEl.html();

		_.each( rawColorValues, ( colorRawValue, colorRawVariable ) => {
			styleString = styleString.replace( new RegExp( colorRawValue, 'g' ), `var(--${colorRawVariable})` );
		} );

		$inlineStyleEl.html( styleString );
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
