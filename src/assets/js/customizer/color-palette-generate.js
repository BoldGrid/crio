var BOLDGRID = BOLDGRID || {};
BOLDGRID.COLOR_PALETTE = BOLDGRID.COLOR_PALETTE || {};
BOLDGRID.COLOR_PALETTE.Generate = BOLDGRID.COLOR_PALETTE.Generate || {};

/**
 * Generate Palettes for a user based on a partial palette.
 * @param $
 */
( function( $ ) {

	'use strict';

	var self = BOLDGRID.COLOR_PALETTE.Generate,
		apiColorCount = {};

	/**
	 * Methods used to generate palettes based on only 1 color.
	 * These methods are included in color.js
	 */
	var colorSchemeMethods = [
		'fiveToneAScheme',
		'fiveToneBScheme',
		'fiveToneCScheme',
		'fiveToneDScheme',
		'fiveToneEScheme',
		'neutralScheme', //Listed multiple times to increase probability of occurrence
		'neutralScheme',
		'neutralScheme',
		'analogousScheme', //Listed multiple times to increase probability of occurrence
		'analogousScheme',
		'analogousScheme'
	];

	/**
	 * Methods used to generate palettes based on only 1 color.
	 * These methods are included in this file.
	 */
	var internalPalettes = [
		'monochromatic',
		'intesityAndHue',
		'complementaryScheme',
		'splitComplementaryScheme',
		'splitComplementaryCWScheme',
		'triadicScheme',
		'tetradicScheme'
	];

	/**
	 * Methods used to complete a partial palette
	 */
	var fillPaletteActions = [
		'compliment',
		'blend',
		'copy'
	];

	/**
	 * Methods used to randomize a palette
	 */
	var methods = [
		'saturateByAmount',
		'lightenByAmount',
		'shiftHue'
	];

	/**
	 * List of predefined neutral colors.
	 *
	 * @since 1.1.1
	 */
	var neutralColors = [
		'#FFFFF2',
		'#FBF5E6',
		'#FFFFFF',
		'#F6F9ED',
		'#FDFDF0',
		'#EBECE4',
		'#ECF1EF',
		'#FFFFFE',
		'#FCF6CF',
		'#FEFFEF',
		'#FFFFFD',
		'#FFFFF3',
		'#FEF1E9',
		'#FEF6E4',
		'#EEF3E2',

		// Dark.
		'#292929',
		'#4d4d4d',
		'#1a1a1a'
	];

	self.paletteCollection = BOLDGRIDColorPalettes.palettes;

	/**
	 * Css Variables.
	 *
	 * Generate CSS Variables for a color palette.
	 *
	 * @ since 2.20.0
	 *
	 * @param {object} colorPalette The Color Palette Object.
	 *
	 * @returns string CSS Variables string.
	 */
	self.cssVariables = function( colorPalette ) {
		var css              = '',
			formattedPalette = {};

		$.each( colorPalette.colors, function( index, color ) {
			var colorIndex = index + 1;

			formattedPalette['color-' + colorIndex ] = color;
		} );

		formattedPalette['color-neutral'] = colorPalette['neutral-color'];

		$.each( formattedPalette, function( variable, color ) {
			css += `--${variable}: ${color};`;
			css += `--${variable}-raw: ` + color.replace( 'rgb(', '' ).replace( ')', '' ) + ';';
			css += `--${variable}-light:` + net.brehaut.Color( color ).lightenByAmount( 0.1 ).toCSS() + ';';
			css += self.generateHoverVars( formattedPalette, variable, color );
		} );

		return css;
	};

	/**
	 * Generates CSS Variables for hover colors.
	 *
	 * @since 2.20.0
	 *
	 * @param {object} formattedPalette Formatted colors object.
	 * @param {string} textVariable     Text color variable.
	 * @param {string} textColor        Text color value.
	 *
	 * @returns {string} CSS Variables string.
	 */
	self.generateHoverVars = function( formattedPalette, textVariable, textColor ) {
		var textIndex = textVariable.replace( 'color-', '' ),
			hoverVars = '';

		$.each( formattedPalette, function( bgVariable, bgColor ) {
			var bgIndex    = bgVariable.replace( 'color-', '' ),
				hoverColor = self.getHoverColor(
					net.brehaut.Color( bgColor ),
					net.brehaut.Color( textColor )
				);

				hoverVars += `--bg-${bgIndex}-text-${textIndex}-hover: ${hoverColor};`;
		} );

		return hoverVars;
	};

	/**
	 * Get Hover Color.
	 *
	 * All the logic for determining the hover color was
	 * derived from the SCSS functions defined prior to the
	 * 2.2.0 release in the following file:
	 *
	 * src/assets/scss/custom-color/color-palettes.scss
	 *
	 * @since 2.20.0
	 *
	 * @param {Color} BgColor   Background Color object.
	 * @param {Color} TextColor Text Color object.
	 *
	 * @returns {string} RGB Color value.
	 */
	self.getHoverColor = function( BgColor, TextColor ) {
		var textLightness = TextColor.getLightness(),
			bgLightness   = BgColor.getLightness(),
			hoverColor;

		// White Text
		if ( 1 === textLightness ) {

			// Dark Background
			if ( 0.9 <= bgLightness ) {
				hoverColor = BgColor.darkenByAmount( 0.15 );

			// Light Background
			} else {
				hoverColor = BgColor.blend( TextColor, 0.8 );
			}

		// Black Text
		} else if ( 0 === textLightness ) {

			// Dark Background
			if ( 0.10 > bgLightness ) {
				hoverColor = BgColor.lightenByAmount( 0.2 );

			// Light Background
			} else {
				hoverColor = BgColor.blend( TextColor, 0.6 );
			}

		// Light Text on Dark Background.
		} else if ( bgLightness < textLightness ) {

			// Color is too light to lighten.
			if ( 0.9 < textLightness ) {
				hoverColor = TextColor.darkenByAmount( 0.2 );
			} else {
				hoverColor = TextColor.lightenByAmount( 0.2 );
			}

		// Dark Text on Light Background.
		} else {

			// Color is too dark to darken.
			if ( 0.15 > textLightness ) {
				hoverColor = TextColor.lightenByAmount( 0.2 );
			} else {
				hoverColor = TextColor.darkenByAmount( 0.2 );
			}
		}

		hoverColor = hoverColor.toRGB();

		return 'rgb(' + Math.floor( hoverColor.red * 255 ) + ',' + Math.floor( hoverColor.green * 255 ) + ',' + Math.floor( hoverColor.blue * 255 ) + ')';
	};

	/**
	 * Get a random color
	 * Not Used ATM
	 */
	self.getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split( '' );
		var color = '#';
		for ( let i = 0; 6 > i; i++ ) {
			color += letters[Math.floor( Math.random() * 16 )];
		}
		return color;
	};

	/**
	 * Get a random element from an array.
	 *
	 * @since 1.1.1
	 *
	 * @return element.
	 */
	self.randomArrayElement = function( array ) {
		return array[ Math.floor( Math.random() * array.length ) ];
	};

	/**
	 * Generates a neutral color.
	 *
	 * @since 1.1.1
	 *
	 * @return string css value of a color.
	 */
	self.generateNeutralColor = function( palette ) {

		var random = Math.random(),
			neutralColor = null,
			randomLimit = 0.5,
			neutralLightness = 0.9,
			paletteColor,
			brehautColor;

		if ( random > randomLimit ) {

			paletteColor = self.randomArrayElement( palette );
			brehautColor = net.brehaut.Color( paletteColor );
			neutralColor = brehautColor.setLightness( neutralLightness ).toCSS();

		} else {
			neutralColor = self.randomArrayElement( neutralColors );
		}

		return neutralColor;
	};

	/**
	 * Calculate differences between 2 colors.
	 *
	 * @param colorA string
	 * @param colorB string
	 * @since 1.1.1
	 *
	 * @return array
	 */
	self.colorDiff = function( colorA, colorB ) {
		var hueDiff,
			saturationDiff,
			lightnessDiff,
			huePercentageDiff,
			saturationPercentageDiff,
			lightnessPercentageDiff,
			totalPercentageDiff;

		colorA = net.brehaut.Color( colorA ).toHSL();
		colorB =  net.brehaut.Color( colorB ).toHSL();

		hueDiff = colorA.hue - colorB.hue;
		saturationDiff = colorA.saturation - colorB.saturation;
		lightnessDiff = colorA.lightness - colorB.lightness;
		huePercentageDiff = Math.abs( hueDiff ) / 360;
		saturationPercentageDiff = Math.abs( saturationDiff );
		lightnessPercentageDiff = Math.abs( lightnessDiff );
		totalPercentageDiff = huePercentageDiff + saturationPercentageDiff + lightnessPercentageDiff;

		return {
			'hue': hueDiff,
			'saturationDiff': saturationDiff,
			'lightnessDiff': lightnessDiff,
			'totalPercentageDiff': totalPercentageDiff
		};
	};

	/**
	 * Finds colors within a palette that are identical.
	 *
	 * @since 1.1.1
	 *
	 * @return object key value pairs of colors and keys that should have the same color.
	 */
	self.findMatches = function( palette ) {

		// Test for matches.
		var matches = {};
		$.each( palette, function( testIndex, testColor ) {
			$.each( palette, function( index, color ) {
				if ( color === testColor && index !== testIndex ) {
					if ( ! matches[color] ) {
						matches[color] = [];
					}

					if ( -1 === matches[color].indexOf( testIndex ) ) {
						matches[color].push( testIndex );
					}
					if ( -1 === matches[color].indexOf( index ) ) {
						matches[color].push( index );
					}
				}
			} );
		} );

		return matches;
	};

	/**
	 * Move array key from 1 index to another.
	 *
	 * Thanks: http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
	 *
	 * @param int
	 * @param int
	 * @since 1.1.1
	 *
	 * @return array
	 */
	self.arrayMove = function( array, newIndex, oldIndex ) {
	if ( newIndex >= array.length ) {
			let k = newIndex - array.length;
			while ( ( k-- ) + 1 ) {
				array.push( undefined );
			}
		}
		array.splice( newIndex, 0, array.splice( oldIndex, 1 )[0] );
		return array;
	};

	/**
	 * Finds colors within a palette that are identical.
	 *
	 * @since 1.1.1
	 *
	 * @return array An array of relationships from a palette.
	 */
	self.findRelations = function( palette ) {
		var matches,
			relations = [];

		matches = self.findMatches( palette );
		if ( false === $.isEmptyObject( matches ) ) {
			$.each( matches, function() {
				relations.push( {
					'type': 'match',
					'values': this
				} );
			} );
		}

		return relations;
	};

	/**
	 * Fins the relationships that currently exists within a palette.
	 *
	 * @since 1.1.1
	 *
	 * @return array relationships that exists within a palette.
	 */
	self.determineRelations = function( paletteData ) {

		/*
		 * Test the Sample Palette.
		 * If a relationship exists within this palette, no more testing will be done and
		 * all relational generating will be based off of this relationship.
		 */
		var paletteRelationships = {},
			relationsData = [],
			relationships = self.findRelations( paletteData.samplePalette );

		/*
		 * If this relationship match involves a locked color skip matching
		 * this relationship all together.
		 */
		$.each( relationships, function() {
			var validRelationship = true;

			$.each( this.values, function() {
				if ( paletteData.partialPalette[ this ] ) {
					validRelationship = false;
					return false;
				}
			} );

			if ( validRelationship ) {
				relationsData.push( this );
			}
		} );

		/*
		 * Test all other predefined palettes.
		 * Find 1 relationship within a list of palettes, if a relationship is found, we will use it
		 * for all relationship suggestions.
		 */
		if ( ! relationsData.length ) {
			$.each( paletteData.additionalSamplePalattes, function() {
				relationsData = self.findRelations( this );
				if ( relationsData.length ) {
					paletteRelationships = {
						'type': 'additionalSamplePalattes',
						'relationsData': relationsData
					};
					return false;
				}
			} );
		} else {
			paletteRelationships = {
				'type': 'samplePalette',
				'relationsData': relationsData
			};
		}

		return paletteRelationships;
	};

	/**
	 * Update a generated palette so that it has the same relationship as a previous palette.
	 *
	 * @since 1.1.1
	 */
	self.applyRelationships = function( palette, paletteRelationships, lockedIndexes ) {
		var newPalette = palette.slice( 0 );

		$.each( paletteRelationships.relationsData, function() {
			var relationship = this,
				copyColorIndex = false;

			if ( 'match' === relationship.type ) {

				$.each( relationship.values, function() {
					var lockedColorIndex = lockedIndexes.indexOf( this );
					if ( -1 !== lockedColorIndex ) {
						copyColorIndex = this;
					}
				} );

				/*
				 * If three of colors should match, grab a random color from one of those slots and
				 * copy it across to the rest of the slots.
				 */
				if ( false === copyColorIndex ) {
					copyColorIndex = relationship.values[ Math.floor( Math.random() * relationship.values.length ) ];
				}

				$.each( relationship.values, function() {
					newPalette[this] = newPalette[copyColorIndex];
				} );
			}
		} );

		return newPalette;
	};

	/**
	 * Check which slots of a palette should remain unmodified.
	 *
	 * @since 1.1.1
	 *
	 * @return array indexes of array that should not be changed.
	 */
	self.findLockedIndexes = function( partialPalette ) {
		var lockedIndexes = [];
		$.each( partialPalette, function( index ) {
			if ( this ) {
				lockedIndexes.push( index );
			}
		} );

		return lockedIndexes;
	};

	/**
	 * Determine the number of palettes that should be returned as relational.
	 *
	 * @since 1.1.1
	 *
	 * @return int number of palettes to return based on another palettes relationships.
	 */
	self.determineRelationalCount = function( type, size ) {
		var relationalPercentage;

		// Percentage of palettes that will be relational if possible.
		relationalPercentage = ( 2 / 3 );
		if ( 'additionalSamplePalattes' === type ) {
			relationalPercentage = ( 1 / 3 );
		}

		return Math.floor( size * relationalPercentage );
	};


	/**
	 * For a given color, return a list of palettes that have a similar color. Sorted by similarity.
	 *
	 * @param string sampleColor
	 * @since 1.1.1
	 *
	 * @return array palettes.
	 */
	self.findPalettesByColor = function( sampleColor ) {
		var palettes = [],
			sort,
			getPalette;

		getPalette = function() {
			return self.paletteCollection[ this.paletteIndex ].slice( 0 );
		};

		$.each( self.paletteCollection, function( paletteIndex ) {
			$.each( this, function( colorIndex ) {
				var colorDiff    = self.colorDiff( this, sampleColor ),
					relationship = {
						'paletteIndex': paletteIndex,
						'colorIndex': colorIndex,
						'distance': colorDiff,
						'getPalette': getPalette
					};

				// Max Hue Diff 16%.
				if ( 16 < colorDiff.hue ) {
					return;
				}

				palettes.push( relationship );
			} );
		} );

		// Sort by diff percentage sum.
		sort = function( a, b ) {
			if ( Math.abs( a.distance.totalPercentageDiff ) > Math.abs( b.distance.totalPercentageDiff ) ) {
				return 1;
			}
			if ( Math.abs( a.distance.totalPercentageDiff ) < Math.abs( b.distance.totalPercentageDiff ) ) {
				return -1;
			}

			return 0;
		};

		palettes.sort( sort );

		return palettes;
	};

	/**
	 * Calls generate palette X times.
	 *
	 * @since 1.0
	 */
	self.generatePaletteCollection = function( paletteData, count ) {

		// Determine Relationships.
		var paletteRelationships = self.determineRelations( paletteData ),
			lockedIndexes        = self.findLockedIndexes( paletteData.partialPalette ),
			palettes             = [],
			relationalCount;

		if ( ! count ) {
			count = 5;
		}

		relationalCount = self.determineRelationalCount( paletteRelationships.type, count );

		for ( let i = 0; i < count; i++ ) {
			let newPalette = self.generatePalette( paletteData );
			if ( 'object' === typeof newPalette && newPalette.length ) {
				let shouldApplyRelationships =
					'samplePalette' === paletteRelationships.type && i < relationalCount ||
					'additionalSamplePalattes' === paletteRelationships.type && ( i >= ( count - relationalCount ) );

				if ( shouldApplyRelationships ) {
					newPalette = self.applyRelationships( newPalette, paletteRelationships, lockedIndexes );
				}

				// Make sure that any locked colors are still locked in suggestions.
				newPalette = self.fixLockedIndex( newPalette, paletteData.partialPalette );

				palettes.push( newPalette );
			}
		}

		return palettes;
	};

	/**
	 * Make sure that any locked colors are still locked in suggestions.
	 *
	 * @since 1.2.7
	 */
	self.fixLockedIndex = function( newPalette, partialPalette ) {

		$.each( partialPalette, function( index ) {
			if ( this ) {
				newPalette[ index ] = this;
			}
		} );

		return newPalette;
	};

	/**
	 * Generate a single palette based on a partial list of colors in a palette.
	 *
	 * @since 1.0
	 */
	self.generatePalette = function( paletteData ) {
		var newPalette = [],
			colorsPartialPalette = self.partialPaletteIntoColorsPalette( paletteData.partialPalette ),
			boolEmptyPalette = self.isPaletteEmpty( colorsPartialPalette.palette ),
			paletteClone;

		// If no colors are locked.
		if ( boolEmptyPalette ) {
			newPalette = self.getPaletteFromStaticList( colorsPartialPalette.palette );
		} else {

			// If the more than 1 color is locked.
			if ( 1 < colorsPartialPalette.generateKeys.length ) {
				let filledPalette = self.generatePaletteFromPartial( colorsPartialPalette.palette );
				newPalette = self.randomizePalette( filledPalette, colorsPartialPalette.unchangedKeys );

			// If only 1 color is locked.
			} else {
				let color = colorsPartialPalette.palette[ colorsPartialPalette.generateKeys[0] ];

				// Generate list of similar palettes if we don't have 1 saved already.
				if ( color.toCSS() !== apiColorCount.color ) {
					apiColorCount.color = color.toCSS();
					apiColorCount.palettes = self.findPalettesByColor( apiColorCount.color );
					apiColorCount.paletteCounter = 0;
				}

				if ( apiColorCount.palettes[ apiColorCount.paletteCounter ] ) {
					newPalette = apiColorCount.palettes[ apiColorCount.paletteCounter ].getPalette();
					newPalette = self.arrayMove( newPalette, colorsPartialPalette.generateKeys[0], this.colorIndex );
					newPalette = self.truncateGeneratedPalette( newPalette, colorsPartialPalette.palette );
					apiColorCount.paletteCounter++;

				} else {

					/*
					 * Try to generate a palette based on the color api color scheme methods.
					 * This is almost never used because it requires users to exhaust ~2500 color combinations.
					 */
					let random = ( Math.floor( Math.random() * 3 ) + 1 );
					if ( 1 === random ) {
						let internalMethod = internalPalettes[ Math.floor( Math.random() * internalPalettes.length ) ];
						newPalette = self.colorPalettes[ internalMethod ]( color );

					} else if ( 2 === random ) {
						let colorsMethod = colorSchemeMethods[ Math.floor( Math.random() * colorSchemeMethods.length ) ];
						newPalette = color[ colorsMethod ]();

					} else {
						let degrees = self.randomArray( 4, 5 );
						degrees.unshift( 0 );
						newPalette = color.schemeFromDegrees( degrees );
					}

					newPalette = self.randomizePalette( newPalette, [ 0 ] );
					newPalette = self.formatPaletteToUnchanged( newPalette, colorsPartialPalette.generateKeys[0] );
					newPalette = self.truncateGeneratedPalette( newPalette, colorsPartialPalette.palette );
				}
			}
		}

		// Set unchanged keys.
		paletteClone = newPalette.slice( 0 );
		$.each( colorsPartialPalette.unchangedKeys, function() {
			paletteClone[this] = paletteData.partialPalette[this];
		} );

		return paletteClone;
	};

	/**
	 * If the user requests a 3 color palette and we generate a 5 color palette. trim the
	 * last 2 color in a palette
	 */
	self.truncateGeneratedPalette = function( generatedPalette, givenPartialPalette ) {
		var truncatedPalette = [];
		for ( let i = 0; i < givenPartialPalette.length; i++ ) {
			truncatedPalette.push( generatedPalette[ i ] );
		}

		return truncatedPalette;
	};

	/***
	 * Place the single color in the correct placement
	 */
	self.formatPaletteToUnchanged = function( newPalette, neededKey ) {
		var selectedColor  = newPalette[0],
			formatedPalette = {};

		formatedPalette[ neededKey ] = selectedColor;
		formatedPalette[0]           = newPalette[ neededKey ];

		$.each( newPalette, function( key ) {
			if ( 0 === key ) {
				return;
			}

			if ( key !== neededKey ) {
				formatedPalette[ key ] = ( this );
			}
		} );

		/*jshint unused:false*/
		formatedPalette = $.map( formatedPalette, function( value ) {
			return [ value ];
		} );

		return formatedPalette;
	};

	/**
	 * Take a partial palette and convert the color values from css to Color objects
	 */
	self.partialPaletteIntoColorsPalette = function( partialPalette ) {
		var colorPalette = [],
			unchangedKeys = [],
			generateKeys = [];
		$.each( partialPalette, function( key ) {
			var color;
			if ( this ) {
				color = net.brehaut.Color( this );

				// Colors that are to dark, light, or not saturated enough, should not be used for color calculations.
				if ( ( 0.90 ) > color.getLightness() && ( 0.10 ) < color.getLightness() && ( 0.15 ) < color.getSaturation() ) {
					colorPalette.push( color );
					generateKeys.push( key );
				} else {
					colorPalette.push( null );
				}

				unchangedKeys.push( key );
			} else {
				colorPalette.push( null );
			}
		} );

		return {
			'palette': colorPalette,
			'unchangedKeys': unchangedKeys,
			'generateKeys': generateKeys
		};
	};

	/**
	 * Get a palette from the color lovers list of palettes or otherwise
	 */
	self.getPaletteFromStaticList = function( partialPalette ) {
		var newPalette = [];

		// Try up to 2 times to find a palette.
		$.each( [ 1, 2 ], function() {
			var foundPalette = self.paletteCollection[ Math.floor( Math.random() * self.paletteCollection.length ) ];
			if ( foundPalette.length >= partialPalette.length ) {
				if ( foundPalette.length > partialPalette.length ) {
					for ( let i = 0; i < partialPalette.length; i++ ) {
						newPalette.push( foundPalette[i] );
					}
				} else if ( foundPalette.length === partialPalette.length ) {
					newPalette = foundPalette;
				}
			}

			if ( newPalette.length ) {

				// Break out of the loop if found.
				return false;
			}
		} );

		return newPalette;
	};

	/**
	 * Check if an array has no color definitions.
	 */
	self.isPaletteEmpty = function( partialPalette ) {
		var emptyPalette = true;
		$.each( partialPalette, function() {
			if ( this ) {
				emptyPalette = false;
				return false;
			}
		} );

		return emptyPalette;
	};

	/**
	 * Get a random shade of grey
	 */
	self.getGrey = function() {
		var Color = net.brehaut.Color( '#FFFFFF' );
		return Color.setBlue( 0 ).setRed( 0 ).setGreen( 0 ).setLightness( Math.random() ).toCSS();
	};

	/**
	 * Covert an array of color objects to an array of css color definitions
	 */
	self.colorArrayToCss = function( colors ) {
		var cssColors = [];
		$.each( colors, function( key ) {
			if ( 5 > key ) {
				cssColors.push( this.toCSS() );
			}
		} );
		return cssColors;
	};


	/**
	 * This function is used to create the rest of a palette if more than 1 color is given
	 */
	self.generatePaletteFromPartial = function( colors ) {
		var actualColors = [],
			paletteColors = [];
		$.each( colors, function( key, thisValue ) {
			if ( thisValue ) {
				actualColors.push( thisValue );
			}
		} );

		$.each( colors, function( key, thisValue ) {
			var action = fillPaletteActions[ Math.floor( Math.random() * fillPaletteActions.length ) ],
				paletteColor = actualColors[ Math.floor( Math.random() * actualColors.length ) ],
				paletteColor2 = actualColors[ Math.floor( Math.random() * actualColors.length ) ],
				newColor;
			if ( ! thisValue ) {
				if ( 'compliment' === action ) {
					newColor = paletteColor.shiftHue( 180 );
				} else if ( 'blend' === action ) {
					newColor = paletteColor.blend( paletteColor2, 0.5 );
				} else {
					newColor = paletteColor;
				}
				paletteColors.push( newColor );
			} else {
				paletteColors.push( thisValue );
			}
		} );

		return paletteColors;
	};

	/**
	 * Take a palette palette and shaift the values slighly in order to provide the
	 * appearence of a completely new palette
	 * This function essentially makes a palette lighter/darker, saturates and hue shifts
	 */
	self.randomizePalette = function( palette, unchangedKeys ) {
		var paletteColors = [];
		$.each( palette, function( key ) {
			var color  = this,
				method = methods[Math.floor( Math.random() * methods.length )];

			if ( 5 <= key ) {
				return false;
			}

			if ( -1 !== unchangedKeys.indexOf( key ) ) {
				paletteColors.push( this.toCSS() );
				return;
			}

			for ( let i = 0; 2 > i; i++ ) {
				let value;
				if ( 'shiftHue' === method ) {
					value = ( Math.floor( Math.random() * 45 ) + 1 ) - 23;
				} else {
					value = ( Math.floor( Math.random() * 20 ) + 1 ) / 100;
				}

				color = color[method]( value );
				if ( 1 === i ) {
					paletteColors.push( color.toCSS() );
				}
			}
		} );

		return paletteColors;
	};

	/**
	 * Create an array with random variance values
	 */
	self.randomArray = function( size, varianceScale ) {
		var degrees = [];

		var range = 45 * varianceScale;
		for ( let i = 0; i < size; i++ ) {
			degrees.push( ( Math.floor( Math.random() * range ) + 1 ) - ( range / 2 ) );
		}
		return degrees;
	};

	/**
	 * These color palettes are used when the user only provides 1 color
	 * and would like to generate a palette
	 * These definitions come from the color.js file and include expansion of colors to 5
	 */
	self.colorPalettes = {

		monochromatic: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.lightenByAmount( 0.3 ) );
			paletteColors.push( color.darkenByAmount( 0.1 ) );
			paletteColors.push( color.saturateByAmount( 0.5 ) );
			paletteColors.push( color.lightenByAmount( 0.2 ) );
			return paletteColors;
		},

		// Tims Palette.
		intesityAndHue: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 20 ).lightenByAmount( 0.15 ) );
			paletteColors.push( color.shiftHue( -20 ).darkenByAmount( 0.20 ) );
			paletteColors.push( color.shiftHue( -33 ).darkenByAmount( 0.25 ) );
			paletteColors.push( color.shiftHue( 10 ).lightenByAmount( 0.05 ) );

			return paletteColors;
		},

		complementaryScheme: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 180 ) );
			paletteColors.push( color.shiftHue( 180 ).lightenByAmount( 0.25 ) );
			paletteColors.push( color.darkenByAmount( 0.25 ) );
			paletteColors.push( color.lightenByAmount( 0.25 ) );

			return paletteColors;
		},

		splitComplementaryScheme: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 150 ) );
			paletteColors.push( color.shiftHue( 320 ) );
			paletteColors.push( color.shiftHue( 320 ).darkenByAmount( 0.25 ) );
			paletteColors.push( color.lightenByAmount( 0.25 ) );

			return paletteColors;
		},

		splitComplementaryCWScheme: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 60 ) );
			paletteColors.push( color.shiftHue( 210 ) );
			paletteColors.push( color.darkenByAmount( 0.1 ) );
			paletteColors.push( color.shiftHue( 60 ).darkenByAmount( 0.15 ) );

			return paletteColors;
		},

		triadicScheme: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 60 ) );
			paletteColors.push( color.shiftHue( 240 ) );
			paletteColors.push( color.shiftHue( 60 ).lightenByAmount( 0.2 ) );
			paletteColors.push( color.lightenByAmount( 0.15 ) );

			return paletteColors;
		},

		tetradicScheme: function( color ) {
			var paletteColors = [];
			paletteColors.push( color );
			paletteColors.push( color.shiftHue( 90 ) );
			paletteColors.push( color.shiftHue( 180 ) );
			paletteColors.push( color.shiftHue( 270 ) );
			paletteColors.push( color.saturateByAmount( -0.25 ) );

			return paletteColors;
		}
	};

} )( jQuery );
