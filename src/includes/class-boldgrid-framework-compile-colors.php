<?php
/**
 * Class: Boldgrid_Framework_SCSS
 *
 * Functions for interfacing with ScssPhp\ScssPhp\Compiler
 *
 * @since      1.0.0
 * @package    Boldgrid_Framework
 * @subpackage Boldgrid_Framework_SCSS
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Framework_Bootstrap_Compile
 *
 * Functions for interfacing with ScssPhp\ScssPhp\Compiler
 *
 * @since      1.0.0
 */
class Boldgrid_Framework_Compile_Colors {

	/**
	 * The BoldGrid Theme Framework configurations.
	 *
	 * @since     1.0.0
	 * @access    protected
	 * @var       string     $configs       The BoldGrid Theme Framework configurations.
	 */
	protected $configs;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since     1.0.0
	 * @param     string $configs       The BoldGrid Theme Framework configurations.
	 */
	public function __construct( $configs ) {
		$this->configs = $configs;
	}

	/**
	 * Get Active Palette Colors.
	 *
	 * @since 1.1
	 * @return array $boldgrid_colors Array containing SCSS variable name.
	 */
	public function get_active_palette() {
		$boldgrid_colors = array();
		$palettes = $this->get_palette();

		if ( ! empty( $palettes ) ) {
			$current_palette = $palettes['state']['active-palette'];

			$colors = array();

			if ( empty( $palettes['state']['palettes'][ $current_palette ]['colors'] ) ) {
				$activate = new Boldgrid_Framework_Activate( $this->configs );
				$option = 'theme_mods_' . get_stylesheet();
				$activate->set_palette( $option );
			}

			if ( is_array( $palettes['state']['palettes'][ $current_palette ]['colors'] ) ) {
				$colors = $palettes['state']['palettes'][ $current_palette ]['colors'];
			}

			$i = 0;
			foreach ( $colors as $color ) {
				$i++;
				$boldgrid_colors[ $current_palette . '_' . $i ] = $color;
			}
		}
		if ( false !== self::get_neutral_color() ) {
			$boldgrid_colors = array_merge( $boldgrid_colors, self::get_neutral_color() );
		}
		return $boldgrid_colors;
	}

	/**
	 * Get current palette colors.
	 *
	 * @since 1.2.8
	 * @return array Current Active Palette.
	 */
	public function get_palette() {
		global $boldgrid_theme_framework;

		$palette = ! empty( $boldgrid_theme_framework->palette_changeset ) ?
			$boldgrid_theme_framework->palette_changeset :
			get_theme_mod( 'boldgrid_color_palette' );
		$palettes = json_decode( $palette, true );

		if ( empty( $palettes ) ) {
			$activate = new Boldgrid_Framework_Activate( $this->configs );
			$option = 'theme_mods_' . get_stylesheet();
			$activate->set_palette( $option );
			$palette = ! empty( $boldgrid_theme_framework->palette_changeset ) ?
			$boldgrid_theme_framework->palette_changeset : get_theme_mod( 'boldgrid_color_palette' );
			$palettes = json_decode( $palette, true );
		}

		return $palettes;
	}

	/**
	 * Get SCSS list for $colors variable.
	 *
	 * @since 1.2.3
	 * @return array $boldgrid_colors Array containing SCSS variable name.
	 */
	public function get_color_list() {
		$boldgrid_colors = '';
		$palettes = $this->get_palette();

		if ( ! empty( $palettes ) ) {
			$current_palette = $palettes['state']['active-palette'];
			$colors = is_array( $palettes['state']['palettes'][ $current_palette ]['colors'] ) ?
				$palettes['state']['palettes'][ $current_palette ]['colors'] : array();

			foreach ( $colors as $color ) {
				$boldgrid_colors .= "{$color} ";
			}
		}
		return $boldgrid_colors;
	}

	/**
	 * Get the neutral color if it exists.
	 *
	 * @since 1.2.3
	 * @return array $color_variables Array containing SCSS variables and values.
	 */
	public function get_neutral_color() {
		$neutral_color = false;
		$palettes = $this->get_palette();

		// This prevents throwing warnings in php7.4 when $palettes is null.
		if ( ! $palettes ) {
			return false;
		}

		$current_palette = $palettes['state']['active-palette'];
		if ( ! empty( $palettes['state']['palettes'][ $current_palette ]['neutral-color'] ) ) {
			$neutral_color = array(
				$palettes['state']['active-palette'] . '-neutral-color' => $palettes['state']['palettes'][ $current_palette ]['neutral-color'],
			);
		}
		return $neutral_color;
	}

	/**
	 * Get all color variables for compiling.
	 *
	 * @since 1.2.3
	 * @return array $color_variables Array containing SCSS variables and values.
	 */
	public function get_scss_variables() {
		$color_variables = array();
		$text_colors = array(
			'light_text' => $this->configs['customizer-options']['colors']['light_text'],
			'dark_text' => $this->configs['customizer-options']['colors']['dark_text'],
		);
		$active_palette = array(
			'colors' => self::get_color_list(),
		);
		$color_variables = array_merge( $active_palette, $text_colors, self::get_active_palette(), self::get_text_contrast() );
		if ( true === $this->configs['components']['buttons']['enabled'] ) {
			$btn_variables = $this->configs['components']['buttons']['variables'];
			$color_variables = array_merge( $color_variables, $btn_variables );
			$color_variables['ubtn-colors'] = $this->get_button_colors();
			$color_variables['ubtn-bgcolor'] = '$' . get_theme_mod( 'boldgrid_palette_class', 'palette-primary' ) . '_' . $this->get_button_default_color() . ';';
			$color_variables['ubtn-font-color'] = '$text-contrast-' . get_theme_mod( 'boldgrid_palette_class', 'palette-primary' ) . '_' . $this->get_button_default_color() . ';';
			$color_variables['ubtn-theme-color'] = get_theme_mod( 'boldgrid_palette_class', 'palette-primary' ) . '_' . $this->get_button_default_color() . ';';
		}

		return $color_variables;
	}

	/**
	 * Generate SCSS variables for Hover Colors.
	 *
	 * @since 2.20.0
	 *
	 * @param array  $formatted_palette Array of formatted palette colors.
	 * @param string $text_color_name   Property to generate hover colors for.
	 * @param string $text_color_value  Value of color.
	 *
	 * @return string $scss_variables  SCSS variables for hover colors.
	 */
	public function generate_hover_variables( $formatted_palette, $text_color_name, $text_color_value ) {
		$hover_variables    = '';
		$text_index         = str_replace( 'color-', '', $text_color_name );
		$text_rgba_array    = $this->get_rgb_array( $text_color_value );
		$light_hsla_array   = $this->rgba_to_hsla( $text_rgba_array, 10 );
		$lighter_hsla_array = $this->rgba_to_hsla( $text_rgba_array, 20 );
		$dark_hsla_array    = $this->rgba_to_hsla( $text_rgba_array, -10 );
		$darker_hsla_array  = $this->rgba_to_hsla( $text_rgba_array, -20 );

		foreach ( $formatted_palette as $bg_color_name => $bg_color_value ) {
			$bg_index    = str_replace( 'color-', '', $bg_color_name );
			$hover_color = $this->get_hover_color(
				$this->normalize( $bg_color_value ),
				$this->normalize( $text_color_value )
			);
			$hover_variables .= "--bg-$bg_index-text-$text_index-hover: $hover_color;";
		}

		return $hover_variables;
	}

	/**
	 * Get the hover color for a given background and text color.
	 *
	 * All the logic for determining the hover color was
	 * derived from the SCSS functions defined prior to the
	 * 2.2.0 release in the following file:
	 *
	 * src/assets/scss/custom-color/color-palettes.scss
	 *
	 * @since 2.20.0
	 *
	 * @param string $bg_color_value  Background color value.
	 * @param string $text_color_value Text color value.
	 *
	 * @return string $hover_color    Hover color.
	 */
	public function get_hover_color( $bg_color_value, $text_color_value ) {
		$text_lightness = intval( $this->get_luminance( $text_color_value ) );
		$bg_lightness   = intval( $this->get_luminance( $bg_color_value ) );
		$bg_rgb_array   = $this->get_rgb_array( $bg_color_value );
		$text_rgb_array = $this->get_rgb_array( $text_color_value );

		if ( 100 === $text_lightness ) {
			// White text.
			if ( 90 <= $bg_lightness ) {
				// Light background.
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $bg_rgb_array, -15 )
				);
			} else {
				// Dark background.
				$hover_color = $this->rgba_array_to_string(
					$this->mix_rbg_colors( $text_rgb_array, $bg_rgb_array, 0.8 )
				);
			}
		} elseif ( 0 === $text_lightness ) {
			// Black text.
			if ( 10 > $bg_lightness ) {
				// Dark background.
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $bg_rgb_array, 20 )
				);
			} else {
				// Light background.
				$hover_color = $this->rgba_array_to_string(
					$this->mix_rbg_colors( $text_rgb_array, $bg_rgb_array, 0.6 )
				);
			}
		} elseif ( $bg_lightness < $text_lightness ) {
			// Light text on dark background.
			if ( 90 < $text_lightness ) {
				// Color to light to lighten.
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $text_rgb_array, -20 )
				);
			} else {
				// Dark background.
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $text_rgb_array, 20 )
				);
			}
		} else {
			// Dark text on light background.
			if ( 15 > $text_lightness ) {
				// Color is too dark to darken.
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $text_rgb_array, 20 )
				);
			} else {
				$hover_color = $this->hsla_array_to_string(
					$this->rgba_to_hsla( $text_rgb_array, -20 )
				);
			}
		}

		return $hover_color;
	}

	/**
	 * RGBA array to string.
	 *
	 * Convert an RGBA array to a formatted string.
	 *
	 * @since 2.20.0
	 *
	 * @param array $rgba_array RGBA array.
	 *
	 * @return string $rgba_string RGBA string.
	 */
	public function rgba_array_to_string( $rgba_array ) {
		$r = $rgba_array[0];
		$g = $rgba_array[1];
		$b = $rgba_array[2];
		$a = isset( $rgba_array[3] ) ? $rgba_array[3] : 1;

		$rgba_string = 'rgba(' . $r . ',' . $g . ',' . $b . ',' . $a . ')';
		return $rgba_string;
	}

	/**
	 * HSLA array to string.
	 *
	 * Convert an HSLA array to a formatted string.
	 *
	 * @since 2.20.0
	 *
	 * @param array $hsla_array HSLA array.
	 *
	 * @return string $hsla_string HSLA string.
	 */
	public function hsla_array_to_string( $hsla_array ) {
		$h = $hsla_array[0];
		$s = $hsla_array[1];
		$l = $hsla_array[2];
		$a = isset( $hsla_array[3] ) ? $hsla_array[3] : 1;

		$hsla_string = 'hsla(' . $h . ',' . $s . ',' . $l . ',' . $a . ')';
		return $hsla_string;
	}

	/**
	 * Mix Two RGB Colors.
	 *
	 * @since 2.20.0
	 *
	 * @param array $color_1 RGB Color 1.
	 * @param array $color_2 RGB Color 2.
	 * @param float $weight  Mix Weight.
	 *
	 * @return array $mixed_color Mixed Color.
	 */
	public function mix_rbg_colors( $color_1 = array( 0, 0, 0 ), $color_2 = array( 0, 0, 0 ), $weight = 0.5 ) {
		$f = function ( $x ) use ( $weight ) {
			return $weight * $x;
		};

		$g = function ( $x ) use ( $weight ) {
			return ( 1 - $weight ) * $x;
		};

		$h = function ( $x, $y ) {
			return round( $x + $y );
		};

		return array_map( $h, array_map( $f, $color_1 ), array_map( $g, $color_2 ) );
	}

	/**
	 * Converts a hex color into an array of RGB.
	 *
	 * @since 1.1
	 * @param string $hex Hex color to conver to RGB.
	 * @return array $rgb An array with rgb values of color.
	 */
	public function convert_hex_to_rgb( $hex ) {
		$hex = str_replace( '#', '', $hex );

		if ( strlen( $hex ) === 3 ) {
			$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
			$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
			$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
		} else {
			$r = hexdec( substr( $hex, 0, 2 ) );
			$g = hexdec( substr( $hex, 2, 2 ) );
			$b = hexdec( substr( $hex, 4, 2 ) );
		}

		$rgb = array( $r, $g, $b );

		return $rgb;
	}

	/**
	 * Calculate out the luminance of a given color.
	 *
	 * This can accept color in rgb or hexadecimal format to have it's
	 * luminance calculated out.
	 *
	 * @since 1.1
	 * @param string $color Color to get luminance of.
	 * @return string $luminance the luminance value of color.
	 */
	public function get_luminance( $color ) {
		$luminance = null;
		if ( ! empty( $color ) ) {
			// Check for RGB or hex first.
			if ( false !== strpos( $color, '#' ) ) {
				$rgb_arrays = self::convert_hex_to_rgb( $color );
			} elseif ( false !== strpos( $color, 'rgb' ) ) {
				$rgb_arrays = preg_replace( '/\D/', '', explode( ',', $color ) );
			}

			// Assign RGB.
			$r = intval( $rgb_arrays[0] );
			$g = intval( $rgb_arrays[1] );
			$b = intval( $rgb_arrays[2] );

			// Calculate Luminance.
			$luminance = strval( ( ( ( $r * .299 ) + ( $g * .587 ) + ( $b * .114 ) ) / 255 ) * 100 );
		}
		return $luminance;
	}

	/**
	 * Get the text contrast color for a color.
	 *
	 * This will generate the text contrast colors in PHP to pass to scss compiler.
	 *
	 * @since 1.1
	 * @return array $text_contrast_colors Array of text contrast variables to pass.
	 */
	public function get_text_contrast() {
		$text_contrast_colors = array();
		// Color Configs.
		$configs = $this->configs['customizer-options']['colors'];
		// Get the active color palette.
		$colors = self::get_active_palette();
		// Determine luminance values of light and dark text.
		$light_text = self::get_luminance( $configs['light_text'] );
		$dark_text = self::get_luminance( $configs['dark_text'] );

		foreach ( $colors as $key => $color ) {
			$color = self::get_luminance( $color );
			$lightness = abs( $color - $light_text );
			$darkness = abs( $color - $dark_text );

			if ( $lightness > $darkness ) {
				$text_contrast_colors[ 'text-contrast-' . $key ] = $configs['light_text'];
			} else {
				$text_contrast_colors[ 'text-contrast-' . $key ] = $configs['dark_text'];
			}
		}

		return $text_contrast_colors;
	}

	/**
	 * Get Button Colors to Compile.
	 *
	 * @since 1.1
	 * @return array $boldgrid_colors Array containing SCSS variable name.
	 */
	public function get_button_colors() {
		$boldgrid_colors = '';
		$palettes = $this->get_palette();

		if ( ! empty( $palettes ) ) {
			$current_palette = $palettes['state']['active-palette'];
			$colors = is_array( $palettes['state']['palettes'][ $current_palette ]['colors'] ) ?
				$palettes['state']['palettes'][ $current_palette ]['colors'] : array();

			$i = 0;
			foreach ( $colors as $color ) {
				$i++;
				$boldgrid_colors .= '("color-' . $i . '" $' . $current_palette . '_' . $i . ' $text-contrast-' . $current_palette . '_' . $i . ')';
			}
			if ( ! empty( $palettes['state']['palettes'][ $current_palette ]['neutral-color'] ) ) {
				$boldgrid_colors .= '("neutral-color" $' . $current_palette . '-neutral-color $text-contrast-' . $current_palette . '-neutral-color)';
			}
		}

		return $boldgrid_colors;
	}

	/**
	 * Gets default button color class.
	 *
	 * @since 1.1
	 *
	 * @return string $class The class of the default button color found.
	 */
	public function get_button_default_color() {
		$s = $this->configs['components']['buttons']['variables'];
		$classes = ! empty( $s['button-primary-classes'] ) ? $s['button-primary-classes'] : null;
		$class = array();
		if ( ! empty( $classes ) ) {
			$classes = str_replace( ' ', '', $classes );
			$classes = explode( ',', str_replace( '.btn-', '', $classes ) );
			// Get the default color class if it's defined.
			$class = array_filter( $classes, function( $c ) {
				return strpos( $c, 'color' ) !== false;
			});
		}

		// Use the class found if one is located or use the first color from palette.
		if ( empty( $class ) ) {
			$class[] = '1';
		}

		$class = reset( $class );
		$class = str_replace( 'color-', '', $class );

		return $class;
	}

	/**
	 * Grabs the appropriate files for default button configs to compile.
	 *
	 * This will see what files are needed based on the configs for
	 * button-primary and button-secondary button classes.
	 *
	 * @since 1.2.4
	 * @return array $files An array of files to use in color compile.
	 */
	public function get_button_color_files( $files ) {
		$s = $this->configs['components']['buttons']['variables'];
		$path = $this->configs['framework']['asset_dir'] . 'scss/custom-color/buttons/';
		$configs = array();
		// Build an array of button-classes that are needed.
		if ( ! empty( $s['button-primary-classes'] ) ) {
			$configs[] = $s['button-primary-classes'];
		}

		if ( ! empty( $s['button-secondary-classes'] ) ) {
			$configs[] = $s['button-secondary-classes'];
		}

		if ( ! empty( $configs ) ) {
			foreach ( $configs as $config ) {
				// Remove whitespace out of strings
				$config = str_replace( ' ', '', $config );
				// Make an array to filter.
				$config = explode( ',', str_replace( '.btn-', '', $config ) );
				// We don't need the base class.
				if ( ( $key = array_search( '.btn', $config ) ) !== false ) {
					unset( $config[ $key ] );
				}
				// Remove any color classes that are defined since we don't need them.
				$config = array_filter( $config, function( $classes ) {
					return strpos( $classes, 'color' ) === false;
				});
				// Translate configs to file path.
				foreach ( $config as $file ) {
					$file = $file . '.scss';
					if ( file_exists( $path . $file ) ) {
						$files[] = $path . $file;
					}
				}
			}
		}

		// Add base file after the rest.
		$base = $path . 'base.scss';
		if ( file_exists( $base ) ) {
			$files[] = $base;
		}
		// Remove any duplicates from array.
		$files = array_unique( $files );

		return $files;
	}

	/**
	 * Normalizes hex, rgb, and rgba colors to rgba.
	 *
	 * This is mainly used for conversion to rgba, and running
	 * comparisons on colors used.
	 *
	 * Examples:
	 *
	 * rgb( 255, 255, 255 )
	 * rgba(0,0,0,.1)
	 * #fff
	 * #B4D455
	 *
	 * @since 2.0.0
	 *
	 * @param string $color Hex, rgb, or rgba strings to normalize.
	 *
	 * @return string $normalized Normalized color string (or empty).
	 */
	public function normalize( $color ) {
		$normalized = '';

		// Prepare color strings to normalize for comparison.
		$test = preg_replace( '/\s+/', '', $color );

		// Hex normalization.
		if ( false !== strpos( $test, '#' ) ) {
			$rgb = $this->convert_hex_to_rgb( $test );
			$normalized = "rgba({$rgb[0]},{$rgb[1]},{$rgb[2]},1)";
		}

		// RGB normalization and validation.
		if ( preg_match( '/rgb\((?:\s*\d+\s*,){2}\s*[\d]+\)/', $test ) ) {
			$normalized = str_replace( 'rgb', 'rgba', str_replace( ')', ',1)', $test ) );
		}

		// RGBA validation.
		if ( preg_match( '/rgba\((\s*\d+\s*,){3}[\d\.]+\)/', $test ) ) {
			$normalized = $test;
		}

		return $normalized;
	}

	/**
	 * Get RGB(A) Array from rgb or rgba string.
	 *
	 * Returns an array of R,G,B,A values from a string.
	 *
	 * @since 2.20.0
	 */
	public function get_rgb_array( $color ) {
		$rgba_string = $this->normalize( $color );
		$rgba_string = str_replace( 'rgba(', '', $rgba_string );
		$rgba_string = str_replace( ')', '', $rgba_string );

		$rgba = explode( ',', $rgba_string );
		return $rgba;
	}

	/**
	 * Convert RGBA to HSLA.
	 *
	 * @since 2.20.0
	 *
	 * @param array $rgba_array        Array of RGBA values.
	 * @param int   $luminosity_adjust Luminosity to adjust (optional).
	 *
	 * @return array $hsla_array         HSLA array.
	 */
	public function rgba_to_hsla( $rgba_array, $luminosity_adjust = 0 ) {
		$r = intval( $rgba_array[0] );
		$g = intval( $rgba_array[1] );
		$b = intval( $rgba_array[2] );
		$a = isset( $rgba_array[3] ) ? $rgba_array[3] : 1;

		$r /= 255;
		$g /= 255;
		$b /= 255;

		$max = max( $r, $g, $b );
		$min = min( $r, $g, $b );

		$h;
		$s;
		$l = ( $max + $min ) / 2;
		$d = $max - $min;

		// If difference is 0, then it's a shade of grey.
		if ( 0 == $d ) {
			$h = 0;
			$s = 0;
		} else {
			$s = $d / ( 1 - abs( 2 * $l - 1 ) );
			switch ( $max ) {
				case $r:
					$h = 60 * fmod( ( ( $g - $b ) / $d ), 6 );
						if ( $b > $g ) {
							$h += 360;
						}
					break;

				case $g:
					$h = 60 * ( ( $b - $r ) / $d + 2 );
					break;

				case $b:
					$h = 60 * ( ( $r - $g ) / $d + 4 );
					break;
			}
		}

		return array(
			round( $h, 2 ),
			round( $s, 2 ) * 100 . '%',
			( round( $l, 2 ) * 100 ) + $luminosity_adjust . '%',
			$a,
		);
	}

	/**
	 * Get color class associated with a color passed in.
	 *
	 * @since 2.0.0
	 *
	 * @param string $color a color to check if in palette and obtain color class for it.
	 * @param string $type CSS property to get color class for. Eg. 'background-color'.
	 *
	 * @return mixed $class String containing color class found for color or false.
	 */
	public function get_color_class( $color, $type ) {
		$class = '';
		$palette = $this->get_palette();
		$current_palette = $palette['state']['active-palette'];
		$colors = is_array( $palette['state']['palettes'][ $current_palette ]['colors'] ) ? $palette['state']['palettes'][ $current_palette ]['colors'] : array();
		$neutral_color = $this->get_neutral_color();

		// Check palette colors.
		foreach ( $colors as $k => $v ) {
			if ( $this->normalize( $v ) === $color ) {
				$class = 'color' . abs( $k + 1 ) . '-' . $type;
			}
		}

		// Check neutral color.
		if ( ! empty( $neutral_color ) ) {
			$neutral_color = $neutral_color[ $current_palette . '-neutral-color' ];
			$neutral_color = $this->normalize( $neutral_color );
			if ( $neutral_color === $color ) {
				$class = 'color-neutral-' . $type;
			}
		}

		return '' !== $class ? $class : false;
	}

	/**
	 * Format color palette to easily get color classes to apply.
	 *
	 * @since  2.0.0
	 *
	 * @param  string $colors Palette to format.
	 *
	 * @return array  $formatted Fromatted color palette.
	 */
	public function color_format( $colors ) {
		$formatted = array();
		$active_palette = get_theme_mod( 'boldgrid_palette_class', 'palette-primary' );

		foreach ( $colors as $k => $v ) {
			if ( $k === $active_palette . '-neutral-color' ) {
				$formatted['color-neutral'] = $v;
			} elseif ( strpos( $k, $active_palette ) !== false ) {
				$formatted[ 'color-' . preg_replace( '/[^0-9]/', '', $k ) ] = $v;
			} else {
				$formatted[ $k ] = $v;
			}
		}

		return $formatted;
	}

	/**
	 * Gets the size of the palette control to add.
	 *
	 * @since 2.0.0
	 *
	 * @param array $palette     The active palette to get the size of.
	 * @param bool  $transparent Palette selector allows transparency option?.
	 *
	 * @return string            Size of each palette square.
	 */
	public function get_palette_size( $palette, $transparent = false ) {
		$colors = 0;
		$max_size = 225;

		if ( ! empty( $palette ) ) {
			$colors = count( $palette );
		}

		if ( true === $transparent ) {
			$colors += 1;
		}

		return 0 !== $colors ? ( string ) floor( $max_size / $colors ) : '0';
	}
}
