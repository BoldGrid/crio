/* global Color:false */
/**
 * Thanks To:
 * http://pluto.kiwi.nz/2014/07/how-to-add-a-color-control-with-alphaopacity-to-the-wordpress-theme-customizer/
 */

jQuery( document ).ready( function( $ ) {
	Color.prototype.toString = function( removeAlpha ) {
		var hex = parseInt( this._color, 10 ).toString( 16 );

		if ( 'no-alpha' === removeAlpha ) {
			return this.toCSS( 'rgba', '1' ).replace( /\s+/g, '' );
		}
		if ( 1 > this._alpha ) {
			return this.toCSS( 'rgba', this._alpha ).replace( /\s+/g, '' );
		}

		if ( this.error ) {
			return '';
		}
		if ( 6 > hex.length ) {
			for ( let i = 6 - hex.length - 1; 0 <= i; i-- ) {
				hex = '0' + hex;
			}
		}

		return '#' + hex;
	};

	$( '.pluto-color-control' ).each( function() {
		var $control = $( this ),
			value = $control.val().replace( /\s+/g, '' ),
			alphaVal,
			palette,
			paletteInput = $control.attr( 'data-palette' ),
			$alphaSlider;

		// Manage Palettes.
		if ( 'false' === paletteInput || false === paletteInput ) {
			palette = false;
		} else if ( 'true' === paletteInput || true === paletteInput ) {
			palette = true;
		} else {
			palette = $control.attr( 'data-palette' ).split( ',' );
		}
		$control.wpColorPicker( { // Change some things with the color picker
			clear: function() {

			// TODO reset Alpha Slider to 100.
			},
			change: function( event, ui ) {

				// Send ajax request to wp.customizer to enable Save & Publish button.
				var newValue = $control.val(),
					key      = $control.attr( 'data-customize-setting-link' ),
					$transparency;
				wp.customize( key, function( obj ) {
					obj.set( newValue );
				} );

				// Change the background color of our transparency container whenever a color is updated.
				$transparency = $control.parents( '.wp-picker-container:first' ).find( '.transparency' );

				// We only want to show the color at 100% alpha.
				$transparency.css( 'backgroundColor', ui.color.toString( 'no-alpha' ) );
			},
			palettes: palette // Remove the color palettes
		} );
		$( '<div class="pluto-alpha-container"><div class="slider-alpha"></div><div class="transparency"></div></div>' ).appendTo( $control.parents( '.wp-picker-container' ) );
		$alphaSlider = $control.parents( '.wp-picker-container:first' ).find( '.slider-alpha' );

		// If in format RGBA - grab A channel value.
		if ( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ ) ) { // eslint-disable-line no-useless-escape
			alphaVal = parseFloat( value.match( /rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/ )[1] ) * 100; // eslint-disable-line no-useless-escape
			alphaVal = parseInt( alphaVal );
		} else {
			alphaVal = 100;
		}
		$alphaSlider.slider( {
			slide: function( event, ui ) {
				var newValue = $control.val(),
					key        = $control.attr( 'data-customize-setting-link' );

				$( this ).find( '.ui-slider-handle' ).text( ui.value ); // Show value on slider handle

				// send ajax request to wp.customizer to enable Save & Publish button.
				wp.customize( key, function( obj ) {
					obj.set( newValue );
				} );
			},
			create: function() {
				var v = $( this ).slider( 'value' );
				$( this ).find( '.ui-slider-handle' ).text( v );
			},
			value: alphaVal,
			range: 'max',
			step: 1,
			min: 1,
			max: 100
		} ); // Slider
		$alphaSlider.slider().on( 'slidechange', function( event, ui ) {
			var newAlphaVal = parseFloat( ui.value ),
				iris = $control.data( 'a8cIris' ),
				colorPicker = $control.data( 'wpWpColorPicker' );
			iris._color._alpha = newAlphaVal / 100.0;
			$control.val( iris._color.toString() );
			colorPicker.toggler.css( {
				backgroundColor: $control.val()
			} );

			// Fix relationship between alpha slider and the 'side slider not updating.
			$( $control ).wpColorPicker( 'color', $control.val() );
		} );
	} ); // Each
} );
