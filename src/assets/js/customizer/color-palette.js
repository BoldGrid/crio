var BOLDGRID = BOLDGRID || {};
BOLDGRID.COLOR_PALETTE = BOLDGRID.COLOR_PALETTE || {};
BOLDGRID.COLOR_PALETTE.Modify = BOLDGRID.COLOR_PALETTE.Modify || {};

/**
 * Handles the UI of a color palette control
 * @param $
 */
( function( $ ) {

	'use strict';

	var $window         = $( window ),
		colorPalette    = BOLDGRID.COLOR_PALETTE.Modify,
		self            = colorPalette,
		defaultNeutrals = [
			'#232323',
			'#FFFFFF',
			'#FF5F5F',
			'#FFDBB8',
			'#FFFFB2',
			'#bad6b1',
			'#99acbf',
			'#cdb5e2'
		];

	colorPalette.pickerCompileDelay = 100;
	colorPalette.pendingCompile = false;
	colorPalette.paletteGenerator = BOLDGRID.COLOR_PALETTE.Generate;
	colorPalette.generatedColorPalettes = 6;
	colorPalette.state = null;
	colorPalette.activeBodyClass = '';
	colorPalette.firstUpdate = true;
	colorPalette.prelockNeutral = false;
	colorPalette.themePalettes = [];

	/**
	 * AutoLoad Function
	 */
	$( function() {
		self.$paletteControlWrapper = $( '#customize-control-boldgrid-color-palette' );
		self.$compiledCssControl = $( '#customize-control-boldgrid_compiled_css input' );
		self.$colorPickerInput = self.$paletteControlWrapper.find( '.pluto-color-control' );
		self.$paletteOptionField = self.$paletteControlWrapper.find( '.palette-option-field' );
		self.generatedPalettesContainer = self.$paletteControlWrapper.find( '.generated-palettes-container' );
		self.$accordionSectionColors = $( '#accordion-section-colors' );
		self.$paletteWrapper = self.$paletteControlWrapper.find( '.boldgrid-color-palette-wrapper' );
		self.hasNeutral = self.$paletteWrapper.data( 'has-neutral' );
		self.numColors = self.$paletteWrapper.data( 'num-colors' );

		// Create icon set variable.
		colorPalette.duplicateModificationIcons();
		colorPalette.themePalettes = colorPalette.getThemePalettes();

		// Bind the actions of the user clicking on one of the icons that removes or adds palettes.
		colorPalette.bindPaletteDuplicateRemove();
		colorPalette.bindPaletteActivation();
		colorPalette.setupColorPicker();
		colorPalette.setupCloseColorPicker();
		colorPalette.setupPaletteGeneration();
		colorPalette.bindGeneratePaletteAction();
		colorPalette.bindHelpLink();
		colorPalette.bindActiveColorClick();

		// Hide Advanced Options.
		colorPalette.setupAdvancedOptions();

		// Action that occurs when color palette is compiled.
		colorPalette.bindCompileDone();

		colorPalette.fetchAcceptablePaletteFormats();

		// Wait 100ms before running this function because it expects WP color picker to be set up.
		setTimeout( colorPalette.wpPickerPostInit, 100 );
	} );

	/**
	 * Get the body of the previewer iframe.
	 *
	 * @since 1.1.7
	 *
	 * @return jQuery Body of iframe.
	 */
	colorPalette.getPreviewerBody = function() {

		// Get the previewer frame.
		return $( wp.customize.previewer.container )
			.find( 'iframe' ).last().contents().find( 'body' );
	};

	/**
	 * Add the color palette transitions class to the body of the iframe.
	 * This allows transitions to affect all elements, class is removed after the direation
	 * of the transition.
	 *
	 * @since 1.1.7
	 */
	colorPalette.addColorTransition = function() {
		var timeout = 600,
			$previewerBody = colorPalette.getPreviewerBody(),
			curTime = new Date().getTime();

		$previewerBody.addClass( 'color-palette-transitions duration-long' );

		self.lastTransitionTime = curTime;
		setTimeout( function() {
			if ( self.lastTransitionTime === curTime ) {
				$previewerBody.removeClass( 'color-palette-transitions duration-long' );
			}
		}, timeout );
	};

	/**
	 * Close Color Picker
	 */
	colorPalette.setupCloseColorPicker = function() {
		self.$closePaletteCreator = $( '<button type="button" class="button close-color-picker">Done</button>' );

		$( '.boldgrid-color-palette-wrapper input[type=text].wp-color-picker' )
			.after( self.$closePaletteCreator );

		self.$closePaletteCreator.on( 'click', function() {
			$( 'body' ).click();
		} );
	};

	/**
	 * Create a list of theme palettes. These are the palettes that come with the theme.
	 *
	 * @since 1.1.1
	 *
	 * @return array list of palettes configured by theme dev.
	 */
	colorPalette.getThemePalettes = function() {
		var themePalettes = [];
		self.$paletteControlWrapper.find( '.boldgrid-inactive-palette[data-copy-on-mod="1"]' ).each( function() {
			var palette = [];

			$( this ).find( '[data-color]' ).each( function() {
				palette.push( $( this ).data( 'color' ) );
			} );

			if ( self.hasNeutral ) {
				palette.splice( -1, 1 );
			}

			themePalettes.push( palette );
		} );

		return themePalettes;
	};

	/**
	 * Bind the handlers for palette generation.
	 */
	colorPalette.setupPaletteGeneration = function() {

		self.$paletteControlWrapper.find( '.palette-generator-button' ).on( 'click', function() {

			if ( false === self.$paletteWrapper.hasClass( 'palette-generate-mode' ) ) {

				if ( self.hasNeutral && self.prelockNeutral ) {

					// Lock it.
					self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors:last' )
						.addClass( 'selected-for-generation' );

					colorPalette.syncLocks();
				}

				self.$paletteWrapper.addClass( 'palette-generate-mode' );
			}
		} );

		self.$paletteControlWrapper.on( 'click', '.palette-generate-mode .current-palette-wrapper .color-lock', function( e ) {
			var $this = $( this );

			e.stopPropagation();

			self.$paletteControlWrapper.find( '.boldgrid-active-palette li' )
				.eq( $this.data( 'count' ) )
				.toggleClass( 'selected-for-generation' );

			$this.toggleClass( 'selected-for-generation' );
		} );

		self.$paletteControlWrapper.find( '.cancel-generated-palettes-button' ).on( 'click', function( e ) {
			var $this = $( this );

			e.stopPropagation();

			// Strip out the auto generated data element.
			self.$paletteControlWrapper
				.find( '.boldgrid-active-palette[data-auto-generated]' )
				.removeAttr( 'data-auto-generated' );

			self.generatedPalettesContainer.empty();

			// Remove All Selected Colors.
			$this.closest( '.palette-generate-mode' )
				.removeClass( 'palette-generate-mode' )
				.find( '.selected-for-generation' )
				.removeClass( 'selected-for-generation' );
		} );
	};

	/**
	 * Clone one of the sets of the icons that are used for deletion and duplication
	 * This is done to make it easier to add them when the palette becomes active
	 */
	colorPalette.duplicateModificationIcons = function() {
		colorPalette.$iconSet = self.$paletteControlWrapper.find( '.boldgrid-duplicate-dashicons' ).first();
		if ( colorPalette.$iconSet ) {
			colorPalette.$iconSet = colorPalette.$iconSet.clone();
		}
	};

	/**
	 * Allow the user to expand an advanced options accordion
	 */
	colorPalette.setupAdvancedOptions = function() {
		self.$paletteControlWrapper.find( '.boldgrid-advanced-options-content' ).hide();

		self.$paletteControlWrapper.find( '.boldgrid-advanced-options' ).on( 'click', function( e ) {
			e.stopPropagation();
		} );

		self.$paletteControlWrapper.find( '.boldgrid-advanced-options-label' ).on( 'click', function( e ) {
			e.stopPropagation();
			$( this ).closest( '.boldgrid-advanced-options' )
				.find( '.boldgrid-advanced-options-content' )
				.stop()
				.slideToggle();
		} );
	};

	/**
	 * Bind the event of the user clicking on the generate palette button
	 */
	colorPalette.bindGeneratePaletteAction = function() {
		self.$paletteControlWrapper.find( '.palette-generator-button' ).on( 'click', function() {
			var paletteData = colorPalette.paletteData(),
				neutralColor = null,
				palettes;

			// If this palette has a neutral color, generate that color independently.
			if ( self.hasNeutral ) {
				paletteData.samplePalette.splice( -1, 1 );
				neutralColor = paletteData.partialPalette.splice( -1, 1 );
				neutralColor = neutralColor[0];
			}

			// Generate Palettes.
			palettes = BOLDGRID.COLOR_PALETTE.Generate.generatePaletteCollection( paletteData, colorPalette.generatedColorPalettes );

			if ( self.hasNeutral ) {
				$.each( palettes, function() {

					// Generate neutral color or pass through existing neutral.
					if ( ! neutralColor ) {
						this.push( colorPalette.paletteGenerator.generateNeutralColor( this ) );
					} else {
						this.push( neutralColor );
					}
				} );
			}

			colorPalette.displayGeneratedPalettes( palettes );
		} );
	};

	/**
	 * Given an array of palettes, display them in the generated palettes section.
	 */
	colorPalette.displayGeneratedPalettes = function( palettes ) {
		var $paletteContainer = self.generatedPalettesContainer.empty(),
			neutralColor = null;

		$.each( palettes, function() {
			var $wrapper = $( '<div data-palette-wrapper="true"><ul><li class="boldgrid-palette-colors"></li></ul></div>' ),
				$newUl,
				$newLi = $newUl.find( 'li' );

			// Currently activate neutral.
			if ( self.hasNeutral ) {
				neutralColor = this[ this.length - 1 ];
			}

			$newUl = $wrapper.find( 'ul' )
				.addClass( 'boldgrid-inactive-palette' )
				.attr( 'data-auto-generated', 'true' )
				.attr( 'data-neutral-color', neutralColor )
				.attr( 'data-color-palette-format', colorPalette.getRandomFormat() );

			$.each( this, function() {
				var $span = $( '<span></span>' )
					.css( 'background-color', this )
					.attr( 'data-color', true );

				$newLi.append( $span );
			} );

			$paletteContainer.append( $wrapper );
		} );
	};

	/**
	 * Grab the selected palettes from the active palette class and add them to an array.
	 *
	 * @since 1.0
	 */
	colorPalette.paletteData = function() {
		var paletteData = {
			'samplePalette': [],
			'partialPalette': [],
			'additionalSamplePalattes': colorPalette.themePalettes
		};

		self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function() {
			var $this = $( this );
			if ( $this.hasClass( 'selected-for-generation' ) ) {
				paletteData.partialPalette.push( $this.css( 'background-color' ) );
			} else {
				paletteData.partialPalette.push( null );
			}

			// Create an array of current colors in the palette.
			paletteData.samplePalette.push( $this.css( 'background-color' ) );
		} );

		return paletteData;
	};

	/**
	 * Get the palette formats that can be used for a palette
	 * palette formats are essentially body classes
	 */
	colorPalette.fetchAcceptablePaletteFormats = function() {

		// Store the color palette accepted formats.
		colorPalette.bodyClasses = self.$paletteControlWrapper
			.find( '.boldgrid-color-palette-wrapper' ).data( 'color-formats' );

		if ( 'object' === typeof colorPalette.bodyClasses ) {
			/*jshint unused:false*/
			colorPalette.bodyClasses = $.map( colorPalette.bodyClasses, function( value ) {
				return [ value ];
			} );
		}
	};

	/**
	 * Take the an active section and change the markup to what the the inactive
	 * palettes should be
	 */
	colorPalette.revertCurrentSelection = function( $paletteWrapper ) {
		var $ul     = $paletteWrapper.find( '> ul' ),
			$newLi  = $( '<li class="boldgrid-palette-colors"></li>' );
		$paletteWrapper.removeClass( 'current-palette-wrapper' );
		$ul.removeClass( 'boldgrid-active-palette' ).addClass( 'boldgrid-inactive-palette' );
		$ul.find( '.boldgrid-duplicate-dashicons' ).remove();
		$ul.find( '.boldgrid-palette-colors:not(.ui-sortable-helper)' ).not( '.ui-sortable-placeholder' ).each( function() {
			var $this = $( this ),
				$span;
			if ( 'absolute' !== $this.css( 'position' ) ) {
				$span = $( '<span data-color="true"></span>' )
					.css( 'background-color', $this.css( 'background-color' ) );
				$newLi.append( $span );
			}
		} );
		$paletteWrapper.find( '.bg-lock-controls' ).remove();

		$newLi.append( colorPalette.$iconSet.clone() );
		$ul.find( '.boldgrid-palette-colors' ).remove();
		$ul.append( $newLi );

		if ( $ul.data( 'ui-sortable' ) ) {
			$ul.sortable( 'disable' );
		}
	};

	/**
	 * Allow user to click on a link inside the help screen to select the first color.
	 */
	colorPalette.bindHelpLink = function() {
		$( '#sub-accordion-section-colors' ).on( 'click', '[data-action="open-color-picker"]', function( e ) {
			var $element = self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors:first' );
			e.stopPropagation();
			colorPalette.activateColor( null, $element );
		} );
	};

	colorPalette.syncLocks = function() {
		var $lockControls = self.$paletteControlWrapper.find( '.bg-lock-controls .color-lock' );
		$lockControls.removeClass( 'selected-for-generation' );
		self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( index ) {
			var $this = $( this );
			if ( $this.hasClass( 'selected-for-generation' ) ) {
				$lockControls.eq( index ).addClass( 'selected-for-generation' );
			}
		} );
	};

	/**
	 * Active a palette
	 * Also apply jquery sortable
	 */
	colorPalette.activatePalette = function( $ul ) {
		var $lockControls,
			$div,
			savedColors,
			$actionButtons;

		colorPalette.addColorTransition();

		self.$paletteControlWrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

		if ( $ul.attr( 'data-auto-generated' ) ) {
			$ul = $ul.closest( 'div' ).clone().find( '[data-auto-generated]' );
		}

		savedColors = [];
		self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( key ) {
			var $this = $( this );
			if ( $this.hasClass( 'selected-for-generation' ) ) {
				savedColors.push( key );
			}
		} );

		// Creating Lists.
		$ul.find( 'span[data-color]' ).each( function( key ) {
			var $this = $( this );
			var backgroundColor = $this.css( 'background-color' );

			// Carry over selected.
			var selectedClass = '';
			if ( -1 !== savedColors.indexOf( key ) ) {
				selectedClass = 'selected-for-generation';
			}

			$ul.append( '<li class="boldgrid-palette-colors ' + selectedClass + ' boldgrid-dashicon" style="background-color: ' + backgroundColor + '"></li>' );
		} );

		$ul.append( colorPalette.$iconSet.clone() );

		// This is the old palette strip that had the colors contained.
		$ul.find( 'li:first' ).remove();
		$div = $ul.closest( 'div' ).addClass( 'current-palette-wrapper' ).detach();
		self.$paletteControlWrapper.find( '.boldgrid-color-palette-wrapper' ).prepend( $div );

		$actionButtons = self.$paletteControlWrapper.find( '.palette-action-buttons' );
		$actionButtons.removeClass( 'hidden' ).insertAfter( $ul );
		colorPalette.$colorPicker.show();

		self.$paletteControlWrapper.find( '.boldgrid-active-palette' ).each( function() {
			var $this = $( this );
			if ( ! $this.attr( 'data-auto-generated' ) ) {
				colorPalette.revertCurrentSelection( $this.closest( 'div' ) );
			} else {
				$this.closest( 'div' ).remove();
			}
		} );

		// Apply Sortable.
		colorPalette.addJquerySortable( $ul );

		$ul.sortable( 'enable' );
		$ul.disableSelection();
		$ul.removeClass( 'boldgrid-inactive-palette' );
		$ul.addClass( 'boldgrid-active-palette' );
		$ul.find( 'li' ).disableSelection();

		$lockControls = $( '<div class="bg-lock-controls"></div>' );
		$ul.find( 'li' ).each( function( index ) {
			$lockControls.append( '<div class="color-lock" data-count="' + index + '"><div class="lock unlock"><div class="top"></div><div class="mid"></div><div class="bottom"><div class="keyhole-top"></div><div class="keyhole-bottom"></div></div></div>' );
		} );
		$ul.after( $lockControls );
		colorPalette.syncLocks();

		if ( ! colorPalette.firstUpdate ) {
			colorPalette.updateThemeOption();
		} else {
			colorPalette.firstUpdate = false;
		}
	};

	/**
	 * Apply jQuery sortable
	 */
	colorPalette.addJquerySortable = function( $ul ) {
		var originalOrder = [],
			originalIndex = null;

		$ul.sortable( {
			items: '.boldgrid-palette-colors',
			axis: 'x',
			start: function( event, ui ) {
				originalOrder = [];
				originalIndex = null;

				if ( ui.item ) {
					self.$paletteControlWrapper
						.find( '.active-palette-section' )
						.removeClass( 'active-palette-section' );

					if ( ! ui.item.find( 'span' ).length ) {
						colorPalette.modifyPaletteAction( ui.item.closest( '[data-palette-wrapper="true"]' ) );
					}

					// Color the placeholder the same as the current drag color.
					ui.placeholder
						.css( 'background-color', ui.item.css( 'background-color' ) )
						.css( 'visibility', 'visible' );

					// Store the original order of colors.
					$ul.find( 'li' ).not( ui.helper ).not( ui.placeholder ).each( function( index ) {
						var $this = $( this );
						originalOrder.push( $this.css( 'background-color' ) );
						if ( $this.is( ui.item ) ) {
							originalIndex = index;
						}
					} );
				}
			},

			// On change, instead of sorting colors. Only swap the placeholder with displaced color.
			change: function( event, ui ) {
				var $listItems = $ul.find( 'li' ).not( ui.helper ).not( ui.item );

				$listItems.each( function( key ) {
					var $this   = $( this ),
						bgColor = originalOrder[ key ];

					if ( $this.is( ui.placeholder ) ) {

						// Set the original slot to the displaced color.
						$listItems.eq( originalIndex ).css( 'background-color', bgColor );
					} else if ( originalIndex !== key ) {

						// The other colors should be unmodified.
						$listItems.eq( key ).css( 'background-color', bgColor );
					}
				} );
			},
			helper: 'clone',
			stop: function( event, ui ) {
				var $toElement,
					$scope;

				colorPalette.addColorTransition();

				colorPalette.updateThemeOption();
				colorPalette.openPicker();
				if ( ui.item ) {
					$toElement = ui.item;
					if ( ! $toElement.find( 'span' ).length ) {
						self.$paletteControlWrapper
							.find( '.active-palette-section' )
							.removeClass( 'active-palette-section' );

						$toElement.addClass( 'active-palette-section' );

						// Toggle this class to make sure that dashicon placement is updated.
						$toElement.siblings().each( function() {
							var $this = $( this );
							$this.toggleClass( 'boldgrid-dashicon' );

							setTimeout( function() {
								$this.toggleClass( 'boldgrid-dashicon' );
							}, 15 );
						} );

						$scope = $toElement.closest( '.boldgrid-color-palette-wrapper' );

						// Change the color of the color picker to the active palette.
						colorPalette.preselectActiveColor( $scope );
						colorPalette.syncLocks();
						colorPalette.updateNeutralData();
					}
				}
			}
		} );
	};

	/**
	 * Grab all the palettes from the DOM and create a variable to be passed to the iframe
	 * via wp_customizer
	 */
	colorPalette.formatCurrentPaletteState = function() {
		var $activePalette = self.$paletteControlWrapper.find( '.boldgrid-active-palette' ).first();

		var palettesObject = {};

		var paletteRoutine = function() {
			var $this             = $( this ),
				$colorBackgrounds = {},
				colors            = [],
				palette;
			if ( $this.hasClass( 'boldgrid-active-palette' ) ) {
				$colorBackgrounds = $this.find( 'li.boldgrid-palette-colors' );
			} else {
				$colorBackgrounds = $this.find( '.boldgrid-palette-colors > span' );
			}

			$colorBackgrounds.not( self.hasNeutral ? ':last-of-type' : '' ).each( function() {
				colors.push( $( this ).css( 'background-color' ) );
			} );

			palette = {
				'format': $this.attr( 'data-color-palette-format' ),
				'colors': colors,
				'neutral-color': $this.attr( 'data-neutral-color' )
			};
			palettesObject.palettes[ $this.attr( 'data-color-palette-format' ) ] = palette;

			if ( ! $this.attr( 'data-copy-on-mod' ) ) {
				palettesObject.saved_palettes.push( palette ); // eslint-disable-line camelcase
			}
		};

		// Initialize palette settings.
		palettesObject['active-palette'] = $activePalette.attr( 'data-color-palette-format' );
		palettesObject['active-palette-id'] = $activePalette.attr( 'data-palette-id' );
		palettesObject.palettes = {};	//A list of palettes to be compiled
		palettesObject.saved_palettes = []; //eslint-disable-line camelcase

		// Store the active body class in the color palette class.
		self.activeBodyClass = palettesObject['active-palette'];

		self.$paletteControlWrapper
			.find( '[data-color-palette-format]' )
			.not( $activePalette )
			.not( '[data-auto-generated="true"]' )
			.each( paletteRoutine );

		$activePalette.each( paletteRoutine );

		return palettesObject;
	};

	/**
	 * Take the colors in a palette and format them into an SCSS format
	 */
	colorPalette.createColorScssFile = function( paletteConfig ) {
		var scssFile  = '',
			textLight = wp.customize( 'boldgrid_light_text' ).get(),
			textDark  = wp.customize( 'boldgrid_dark_text' ).get(),
			colorsPrefix = '$colors: ';

		// Null out variables before use.
		scssFile += '$palette-primary_1: null;$palette-primary_2: null;$palette-primary_3: null;$palette-primary_4: null;$palette-primary_5: null;$palette-primary-neutral-color: null;$text-contrast-palette-primary-1: null;$text-contrast-palette-primary-2: null;$text-contrast-palette-primary-3: null;$text-contrast-palette-primary-4: null;$text-contrast-palette-primary-5: null;$text-contrast-palette-primary-neutral-color: null;';

		$.each( paletteConfig.palettes, function( format ) {
			var classColors = colorsPrefix;
			if ( this.colors ) {
				$.each( this.colors, function( colorOrder ) {
					var actualOrder = colorOrder + 1;
					scssFile += '$' + format + '_' + actualOrder.toString() + ':' + this + ';';
					classColors += '$' + format + '_' + actualOrder.toString() + ' ';
				} );

				if ( classColors !== colorsPrefix ) {
					scssFile += classColors + ';';
				}
			}
			if ( this['neutral-color'] ) {
				scssFile += '$' + format + '-neutral-color:' + this['neutral-color'] + ';';
			}
		} );

		scssFile += '$light-text:' + textLight + ';';
		scssFile += '$dark-text:' + textDark + ';';

		if ( 'undefined' !== typeof BOLDGRIDSass.ButtonVariables ) {
			scssFile += '$ubtn-namespace: "' + BOLDGRIDSass.ButtonVariables['ubtn-namespace'] + '";';
			scssFile += '$ubtn-bgcolor: ' + BOLDGRIDSass.ButtonVariables['ubtn-bgcolor'];
			scssFile += '$ubtn-font-color: ' + BOLDGRIDSass.ButtonVariables['ubtn-font-color'];
			scssFile += '$ubtn-theme-color: ' + BOLDGRIDSass.ButtonVariables['ubtn-bgcolor'].replace( /\$/g, '' );
		}

		if ( 'undefined' !== typeof BOLDGRIDSass.ButtonExtends ) {
			if ( 'undefined' !== typeof BOLDGRIDSass.ButtonExtends.primary ) {
				scssFile += '$button-primary-classes: "' + BOLDGRIDSass.ButtonExtends.primary + '";';
			}
			if ( 'undefined' !== typeof BOLDGRIDSass.ButtonExtends.secondary ) {
				scssFile += '$button-secondary-classes: "' + BOLDGRIDSass.ButtonExtends.secondary + '";';
			}
		}

		return scssFile;
	};

	/**
	 * Update the theme option
	 */
	colorPalette.updateThemeOption = function( options ) {
		var scssFile;
		options = options || {};

		colorPalette.state = colorPalette.formatCurrentPaletteState();

		scssFile = colorPalette.createColorScssFile( colorPalette.state );
		colorPalette.compile( scssFile + '@import "bgtfw/config-files.scss";', options );
	};

	/**
	 * A wrapper for the compile action. Sets the upcoming compile info, overwriting the
	 * most recent request.
	 *
	 * @since 1.1.7
	 */
	colorPalette.compile = function( content, options ) {
		self.pendingCompile = {
			'content': content,
			options: options
		};
		colorPalette.doCompile();
	};

	/**
	 * Grabs the most recent request for a compile and processes it if we are not currently
	 * compiling.
	 *
	 * @since 1.1.7
	 */
	colorPalette.doCompile = function() {
		var currentCompile = self.pendingCompile;

		if ( currentCompile && ! BOLDGRID.Sass.processing ) {
			BOLDGRID.Sass.compile( currentCompile.content, currentCompile.options );
			self.pendingCompile = false;
		}
	};

	/**
	 * When the user clicks on a plattte active it
	 */
	colorPalette.bindPaletteActivation = function() {
		self.$paletteControlWrapper.on( 'click', '.boldgrid-inactive-palette', function() {
			colorPalette.activatePalette( $( this ) );
		} );
	};

	colorPalette.activateColor = function( e, $element, ignoreColorChange ) {
		var $this;
		if ( ! e ) {
			$this = $element;
		} else {

			// This event should not occur during palette generation mode.
			$this = $( this );
			e.stopPropagation();
		}

		if ( false === $this.hasClass( 'active-palette-section' ) ) {

			// If this is a neutral color set a different set of defaults.
			if ( self.hasNeutral && $this.is( '.boldgrid-active-palette .boldgrid-palette-colors:last' ) ) {
				self.$colorPickerInput.iris( { palettes: defaultNeutrals } );
			} else {
				self.$colorPickerInput.iris( { palettes: true } );
			}

			colorPalette.modifyPaletteAction( $this.closest( '[data-palette-wrapper="true"]' ) );

			self.$paletteControlWrapper.find( '.active-palette-section' ).removeClass( 'active-palette-section' );
			$this.addClass( 'active-palette-section' );
			colorPalette.openPicker();

			if ( ignoreColorChange ) {
				self.pauseColorChanges();
			}

			colorPalette.setIrisColor( $this.css( 'background-color' ) );
		}
	};

	/**
	 * Stop compiling colors and allow all events to catch up.
	 *
	 * @since 1.1.7
	 */
	colorPalette.pauseColorChanges = function() {
		self.ignoreColorChange = true;
		setTimeout( function() {
			self.ignoreColorChange = false;
		} );
	};

	colorPalette.openPicker = function() {
		if ( ! self.$paletteControlWrapper.find( '.wp-picker-open' ).length ) {

			self.$paletteControlWrapper.find( '.wp-color-result' ).click();
		}
	};

	colorPalette.setIrisColor = function( cssColor ) {

		// Set the color value.
		var backgroundColor = net.brehaut.Color( cssColor );
		self.$colorPickerInput.iris( 'color', backgroundColor.toString() );
	};

	/**
	 * Update the neutral color data attributes that are used to generate css.
	 *
	 * @since 1.1.1
	 */
	colorPalette.updateNeutralData = function() {
		var hasNeutralColor, currentNeutralColor, $activePalette;

		// If active palette has data-neutral-color.
		hasNeutralColor = !! self.$paletteControlWrapper
			.find( '.boldgrid-active-palette' ).attr( 'data-neutral-color' );

		if ( hasNeutralColor ) {

			// Find the last color in the palette and set its color as the data-neutral.
			$activePalette = self.$paletteControlWrapper.find( '.boldgrid-active-palette' );
			currentNeutralColor = $activePalette.find( '.boldgrid-palette-colors:last' ).css( 'background-color' );
			$activePalette.attr( 'data-neutral-color', currentNeutralColor );
		}
	};

	/**
	 * Set the options for the color picker.
	 */
	colorPalette.setupColorPicker = function() {

		var myOptions = {

				// You can declare a default color here,.

				// or in the data-default-color attribute on the input.
				defaultColor: false,
				change: function( event, ui ) {
					var color,
						currentRefreshtime;

					if ( self.fadeEffectInProgress ) {
						return false;
					}

					color = ui.color.toString();

					self.$paletteControlWrapper
						.find( '.active-palette-section' )
						.css( 'background-color', color );

					// Update the neutral color data elements.
					colorPalette.updateNeutralData();
					colorPalette.updateCustomPalettes();

					if ( self.ignoreColorChange ) {
						return;
					}

					colorPalette.lastRefreshTime = new Date().getTime();
					currentRefreshtime = colorPalette.lastRefreshTime;

					// Update every 100 ms.
					setTimeout( function() {
						var isMostRecent = currentRefreshtime === colorPalette.lastRefreshTime,
							progressiveUpdate = self.mostRecentUpdate + colorPalette.pickerCompileDelay < new Date().getTime();

						if ( isMostRecent || progressiveUpdate ) {
							colorPalette.updateThemeOption();
							self.mostRecentUpdate = new Date().getTime();
						}
					}, colorPalette.pickerCompileDelay, currentRefreshtime );

				},

				// Hide the color picker controls on load.
				hide: true,

				// Show a group of common colors beneath the square.

				// or, supply an array of colors to customize further.
				palettes: true
			};

			self.$colorPickerInput.wpColorPicker( myOptions );
			colorPalette.$colorPicker = self.$paletteControlWrapper.find( '.wp-picker-container' ).hide();
			colorPalette.createPickerPalettes();
			colorPalette.bindCustomPalettes();
	};

	/**
	 * Update the custom colors listed on the right side of your color picker.
	 *
	 * @since 1.1.1
	 */
	colorPalette.updateCustomPalettes = function( index, color ) {
		var $pickerPalettes = self.$paletteControlWrapper.find( '.secondary-colors .iris-palette' );

		if ( index && color ) {

			// Single Update.
			$pickerPalettes
				.eq( index )
				.css( 'background-color', color );
		} else {

			// Update All.
			self.$paletteControlWrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( index ) {

				// Copy Color from active Palette.
				$pickerPalettes.eq( index ).css( 'background-color', $( this ).css( 'background-color' ) );
			} );
		}
	};

	/**
	 * Create a set of squares to display the users current colors on the side of the color picker
	 *
	 * @since 1.1.1
	 */
	colorPalette.createPickerPalettes = function() {
		var $paletteWrapper = $( '<div class="secondary-colors"></div>' );

		for ( let i = 0; i < self.numColors; i++ ) {
			$paletteWrapper.append( '<a class="iris-palette" tabindex="0"></a>' );
		}

		$paletteWrapper.prependTo( self.$paletteControlWrapper.find( '.iris-picker-inner' ) );
	};

	/**
	 * When the user click on a custom color, change the color of the picker.
	 *
	 * @since 1.1.1
	 */
	colorPalette.bindCustomPalettes = function() {
		self.$paletteControlWrapper.find( '.secondary-colors .iris-palette' ).on( 'click', function() {
			colorPalette.setIrisColor( $( this ).css( 'background-color' ) );
		} );
	};

	/**
	 * Set the color on the color palette to the color that has the class ".active-palette-seciton"
	 */
	colorPalette.preselectActiveColor = function( $scope ) {
		colorPalette.setIrisColor( $scope.find( '.active-palette-section' ).css( 'background-color' ) );
	};

	/**
	 * Setup the duplicate nad remove palette icon clicks.
	 */
	colorPalette.bindPaletteDuplicateRemove = function() {
		self.$paletteControlWrapper.on( 'click', '.boldgrid-copy-palette, .boldgrid-remove-palette', function( e ) {

			// Get the closest wrapper of the pallette, this container holds all of the colors.
			var $this           = $( this ),
				$paletteWrapper = $this.closest( '[data-palette-wrapper="true"]' ),
				removal         = true;
			e.stopPropagation();
			if ( $this.hasClass( 'boldgrid-copy-palette' ) ) {
				removal = false;
			}

			if ( removal ) {
				colorPalette.removePalette( $paletteWrapper );
			} else {
				colorPalette.copyPalette( $paletteWrapper );
			}
		} );
	};

	/**
	 * Remove a palette form the list of inactive palettes.
	 */
	colorPalette.removePalette = function( $palette ) {
		if ( $palette.find( '.boldgrid-inactive-palette' ).length ) {
			$palette.remove();
			colorPalette.state = colorPalette.formatCurrentPaletteState();
			colorPalette.updatePaletteSettings();
		}
	};

	/**
	 * Clone a palette
	 */
	colorPalette.modifyPaletteAction = function( $palette ) {
		if ( $palette.find( '[data-copy-on-mod="1"]' ).length ) {
			colorPalette.copyPalette( $palette );
		}
	};

	/**
	 * Triggered when the user presses the copy palette icon
	 * Split into two actions, when the user clicks on a palette that is inactive or active
	 */
	colorPalette.copyPalette = function( $palette ) {
		var $activePalette = $palette.find( '.boldgrid-active-palette' ),
			$clonedPalette,
			$firstInactive,
			$clonedActivePalette;
		if ( $activePalette.length ) {

			// Translate the active palette into an inactive palette, clone to make sure that.

			// the original stays.
			$clonedActivePalette = $palette.clone( false );
			$clonedActivePalette.find( '.palette-action-buttons' ).remove();
			$clonedActivePalette.find( '.boldgrid-active-palette' ).removeAttr( 'data-auto-generated' );

			// Since this item has already been copied, don't preserve it on modification.
			colorPalette.cleanPaletteClone( $palette.find( '.boldgrid-active-palette' ) );

			colorPalette.revertCurrentSelection( $clonedActivePalette );

			// Find the first inactive palette.
			$firstInactive = colorPalette.getFirstInactive();

			// After the palette was changed into an inactive style, wrap it in the standard container.

			// For easy identification purposes.
			$clonedActivePalette.insertBefore( $firstInactive );
		} else if ( $palette.find( '.boldgrid-inactive-palette' ).length ) {

			// Simply copy in place.
			$clonedPalette = $palette.clone( false );

			// Since this item has already been copied, don't preserve it on modification.
			colorPalette.cleanPaletteClone( $clonedPalette.find( '.boldgrid-inactive-palette' ) );

			$palette.after( $clonedPalette );
		}

		colorPalette.state = colorPalette.formatCurrentPaletteState();
		colorPalette.updatePaletteSettings();
	};

	/**
	 * Remove attributes that identify this palette as a hardcoded palette
	 */
	colorPalette.cleanPaletteClone = function( $paletteClone ) {
		$paletteClone.removeAttr( 'data-copy-on-mod data-palette-id' );
	};

	/**
	 * Out of the list of palettes return the first palette that is inactive
	 */
	colorPalette.getFirstInactive = function() {
		return self.$paletteControlWrapper
			.find( '.boldgrid-color-palette-wrapper > [data-palette-wrapper="true"]' )
			.not( '.current-palette-wrapper' )
			.first();
	};

	/**
	 * When the Sass script return that a compile was complete, send the data to the
	 * preview script
	 */
	colorPalette.bindCompileDone = function() {
		$window.on( 'boldgrid_sass_compile_done', function( event, data ) {
			colorPalette.doCompile();
			if ( 'color_palette_focus' !== data.source ) {
				colorPalette.updateIframe( data );
			}
		} );
	};

	colorPalette.updateIframe = function( data ) {
		colorPalette.compiledCss = data.result.text;
		colorPalette.updatePaletteSettings();
	};

	/**
	 * Change the palette settings
	 */
	colorPalette.updatePaletteSettings = function() {
		colorPalette.cssVariables       = BOLDGRID.COLOR_PALETTE.Generate.cssVariables( colorPalette.state.palettes['palette-primary'] );
		colorPalette.state.cssVariables = colorPalette.cssVariables;

		colorPalette.textAreaVal = JSON.stringify( { 'state': colorPalette.state } );
		wp.customize( 'boldgrid_color_palette' ).set( '' ).set( colorPalette.textAreaVal );
	};

	/**
	 * Get a random acceptble format.
	 * TEMP: hardcoded to first palette.
	 */
	colorPalette.getRandomFormat = function() {

		// Return colorPalette.bodyClasses[ Math.floor( Math.random() * colorPalette.bodyClasses.length)];
		return colorPalette.bodyClasses[0];
	};

	/**
	 * Initialization processes to be run after the picker has been initialized
	 */
	colorPalette.wpPickerPostInit = function() {

		// Post Color Picker Load.
		var $activePalette = self.$paletteControlWrapper.find( '.boldgrid-inactive-palette[data-is-active="1"]' );
		var $defaultPalette = self.$paletteControlWrapper.find( '.boldgrid-inactive-palette[data-is-default="1"]' );

		var $paletteToActivate = $defaultPalette;
		if ( $activePalette.length ) {
			$paletteToActivate = $activePalette;
		}

		// Active the palette in the UI.
		$paletteToActivate.click();

		self.$paletteControlWrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

		$( 'body' ).on( 'click', function() {
			self.$paletteControlWrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

				// Remove advanced Options DropDown.
				self.$paletteControlWrapper.find( '.boldgrid-color-palette-wrapper' )
					.find( '.boldgrid-advanced-options' )
					.addClass( 'hidden' );

				// Deselect color.
				self.$paletteControlWrapper
					.find( '.active-palette-section' )
					.removeClass( 'active-palette-section' );
		} );

		// TODO this doesnt work on auto close.
		self.$paletteControlWrapper.find( '.wp-color-result' ).on( 'click', function() {
				var $this = $( this );
				var pickerVisible = $this.parent().find( '.iris-picker' ).is( ':visible' );
				if ( pickerVisible ) {
					$this.removeClass( 'expanded-wp-colorpicker' );

					// Auto Select first color.
					if ( ! self.$paletteControlWrapper.find( '.active-palette-section' ).length ) {
						self.$paletteControlWrapper.find( '.boldgrid-active-palette li:first' ).click();
					}

				} else {

					// Remove advanced Options DropDown.
					$this.closest( '.boldgrid-color-palette-wrapper' )
						.find( '.boldgrid-advanced-options' )
						.addClass( 'hidden' );

					$this.addClass( 'expanded-wp-colorpicker' );
				}

			} );

		self.activeBodyClass = self.$paletteControlWrapper
		.find( '.boldgrid-active-palette' )
		.first()
		.attr( 'data-color-palette-format' );
	};


	/**
	 * Upon clicking a color in the active palette, fade in and out the color on the iframe.
	 *
	 * @since 1.1.7
	 */
	colorPalette.bindActiveColorClick = function() {
		self.$paletteControlWrapper.on( 'click', '.boldgrid-active-palette li', function( e ) {
			var transitionColor,
				backgroundColor,
				$previewerBody,
				timeStartedCompile,
				$this = $( this ),
				originalColor = $this.css( 'background-color' ),
				isNeutral = false,
				desiredDelay = 350,
				transitionDistance = 0.4,
				darknessThreshold = 0.5;

			e.stopPropagation();
			colorPalette.activateColor( null, $( this ), true );

			if ( self.fadeEffectInProgress || ! e.originalEvent ) {
				return;
			}

			// Get the previewer frame.
			$previewerBody = colorPalette.getPreviewerBody();

			if ( self.hasNeutral && $this.is( ':last-of-type' ) ) {
				isNeutral = true;
			}

			// Calculate the color to transition to.
			backgroundColor = net.brehaut.Color( originalColor );
			if ( backgroundColor.getLuminance() > darknessThreshold ) {
				transitionColor = backgroundColor.darkenByAmount( transitionDistance );
				transitionColor = transitionColor.toCSS();
			} else {
				transitionColor = backgroundColor.lightenByAmount( transitionDistance );
				transitionColor = transitionColor.toCSS();
			}

			// Set color to transition to.
			$this.css( 'background-color', transitionColor );
			if ( isNeutral ) {
				$this.closest( '.boldgrid-active-palette' ).attr( 'data-neutral-color', transitionColor );
			}

			// Enable transitions for the colors.
			$previewerBody.addClass( 'color-palette-transitions' );

			// Compile.
			colorPalette.updateThemeOption();

			// Reset Color.
			$this.css( 'background-color', originalColor );
			if ( isNeutral ) {
				$this.closest( '.boldgrid-active-palette' ).attr( 'data-neutral-color', originalColor );
			}

			timeStartedCompile = new Date().getTime();
			self.fadeEffectInProgress = true;

			$window.one( 'boldgrid_sass_compile_done', function() {
				var timeout = 0,
					duration = new Date().getTime() - timeStartedCompile;

				// The compile to fade back in should trigger at a minimum time of desiredDelay.

				// If the compile time exceeds the min than the the timeout will be 0.
				if ( duration < desiredDelay ) {
					timeout = desiredDelay;
				}

				// Wait for compile to finish then fade back in.
				$window.one( 'boldgrid_sass_compile_done', function( event, data ) {
					setTimeout( function() {
						colorPalette.updateIframe( data );
						setTimeout( function() {
							$previewerBody.removeClass( 'color-palette-transitions' );
							self.fadeEffectInProgress = false;
						}, 250 );
					}, timeout );
				} );

				colorPalette.updateThemeOption( { source: 'color_palette_focus' } );
			} );
		} );
	};

} )( jQuery );
