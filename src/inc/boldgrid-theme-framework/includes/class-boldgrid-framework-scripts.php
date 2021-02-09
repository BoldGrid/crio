<?php
/**
 * Class: BoldGrid_Framework_Scripts
 *
 * This is used to enqueue scripts in one place.
 *
 * This pulls configuration, directories and version information from the framework configs.
 *
 * @since      1.0.0
 * @package    BoldGrid_Framework
 * @subpackage BoldGrid_Framework_Scripts
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

// If this file is called directly, abort.
defined( 'WPINC' ) ? : die;

/**
 * Class: BoldGrid_Framework_Scripts
 *
 * This is used to enqueue scripts in one place.
 *
 * This pulls configuration, directories and version information from the framework configs.
 *
 * @since      1.0.0
 */
class BoldGrid_Framework_Scripts {

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
	 * @param     string $configs       The BoldGrid Theme Framework configurations.
	 * @since     1.0.0
	 */
	public function __construct( $configs ) {
		$this->configs = $configs;
	}

	/**
	 * Gets the asset path reference for webpack imports.
	 *
	 * @since 2.1.3
	 */
	public function get_asset_path() {
		return 'BGTFW = BGTFW || {}; BGTFW.assets = BGTFW.assets || {}; BGTFW.assets.path';
	}

	/**
	 * Enqueue the scripts for our BoldGrid Theme.
	 *
	 * @since 1.0.0
	 */
	public function boldgrid_enqueue_scripts() {
		// Minify if script debug is off.
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		/**
		 * Various Bootstrap Shims to adjust styling for WordPress Elements.
		 *
		 * @since 1.0.0
		 */
		wp_enqueue_script(
			'bootstrap-scripts',
			$this->configs['framework']['js_dir'] . 'boldgrid-bootstrap-shim' . $suffix . '.js',
			array( 'jquery' ),
			$this->configs['version'],
			true
		);

		/**
		 * Core Bootstrap.js file.  This is not necessary for all themes, if you don't need it feel free to remove it!
		 *
		 * @since 1.0.0
		 */
		wp_enqueue_script(
			'boldgrid-bootstrap-bootstrap',
			$this->configs['framework']['js_dir'] . 'bootstrap/bootstrap' . $suffix . '.js',
			array( 'jquery' ),
			'3.3.6',
			true
		);
		wp_enqueue_script(
			'bgtfw-smartmenus',
			$this->configs['framework']['js_dir'] . 'smartmenus/jquery.smartmenus.min.js',
			array( 'jquery' ),
			'1.4',
			true
		);

		/**
		 * General Boldgrid scripts
		 *
		 * Used for small snippets of code that should always be applied
		 *
		 * @since 1.0.0
		 */
		wp_register_script(
			'boldgrid-front-end-scripts',
			$this->get_webpack_url( $this->configs['framework']['js_dir'], 'front-end.min.js' ),
			array( 'jquery' ),
			$this->configs['version'],
			true
		);

		wp_register_script(
			'float-labels',
			$this->configs['framework']['js_dir'] . 'float-labels.js/float-labels' . $suffix . '.js',
			array(),
			$this->configs['version'],
			true
		);

		/**
		 * Check to see if comments are open before enqueuing the WP core comment-reply js.
		 *
		 * @since 1.0.0
		 */
		if ( is_singular( ) && comments_open( ) && get_option( 'thread_comments' ) ) {
			wp_enqueue_script( 'comment-reply' );
		}

		/**
		 * Add wow.js for scroll animation events if a theme requests it.
		 *
		 * @since 1.0.0
		 */
		if ( true === $this->configs['scripts']['wow-js'] ) {
			$handle = 'boldgrid-wow-js';
			wp_enqueue_script(
				$handle,
				$this->configs['framework']['js_dir'] . 'wow/wow' . $suffix . '.js',
				array( 'boldgrid-front-end-scripts' ),
				$this->configs['version']
			);
			$wp_scripts = wp_scripts();
			$wow_configs = $this->configs['scripts']['options']['wow-js'];
			$wp_scripts->add_data( $handle, 'data', sprintf( 'var _wowJsOptions = %s;', wp_json_encode( $wow_configs ) ) );
		}

		/**
		 * Add slimscroll support if specified by configs.
		 *
		 * @since 1.0.0
		 */
		if ( true === $this->configs['scripts']['options']['nicescroll']['enabled'] ) {
			wp_enqueue_script(
				'boldgrid-nicescroll-js',
				$this->configs['framework']['js_dir'] . 'niceScroll/jquery.nicescroll.min.js',
				array( 'boldgrid-front-end-scripts' ),
				$this->configs['version']
			);

			$wp_scripts = wp_scripts();
			$nice_configs = $this->configs['scripts']['options']['nicescroll'];
			$wp_scripts->add_data( 'boldgrid-nicescroll-js', 'data', sprintf( 'var _niceScrollOptions = %s;', wp_json_encode( $nice_configs ) ) );
		}

		/**
		 * Add jQuery Goup Scroll To Top Plugin.
		 *
		 * @since 1.0.0
		 */
		if ( true === $this->configs['scripts']['options']['goup']['enabled'] ) {
			wp_enqueue_script(
				'boldgrid-goup-js',
				$this->configs['framework']['js_dir'] . 'goup/jquery.goup.js',
				array( 'boldgrid-front-end-scripts' ),
				$this->configs['version']
			);

			$wp_scripts = wp_scripts();
			$goup_configs = $this->configs['scripts']['options']['goup'];
			$wp_scripts->add_data( 'boldgrid-goup-js', 'data', sprintf( 'var _goupOptions = %s;', wp_json_encode( $goup_configs ) ) );
		}

		/**
		 * Enqueue theme specific javascript if the file exists.
		 *
		 * @since 1.1.5
		 */
		$file = '/js/theme.js';

		if ( file_exists( get_stylesheet_directory() . $file ) ) {
			wp_enqueue_script(
				'theme-js',
				get_stylesheet_directory_uri() . $file,
				array( 'jquery' ),
				$this->configs['version']
			);
		}

		wp_enqueue_script( 'boldgrid-front-end-scripts' );

		wp_localize_script(
			'boldgrid-front-end-scripts',
			$this->get_asset_path(),
			array( $this->configs['framework']['root_uri'] )
		);

		wp_localize_script(
			'boldgrid-front-end-scripts',
			'highlightRequiredFields',
			array( get_option( 'woocommerce_checkout_highlight_required_fields', 'yes' ) )
		);

		wp_enqueue_script( 'float-labels' );
		if ( is_customize_preview() ) {
			wp_enqueue_script(
				'boldgrid-theme-helper-brehaut-color-js',
				$this->configs['framework']['js_dir'] . 'color-js/color.js',
				array(),
				$this->configs['version'],
				false
			);
		}
	}

	/**
	 * Get an asset url conditionally based on webpack server constant.
	 *
	 * @since 2.0.3
	 *
	 * @param  string $path Url to asset dir.
	 * @param  string $file Filename.
	 * @return string       Url of asset.
	 */
	public function get_webpack_url( $path, $file ) {
		$webpack_server_enabled = defined( 'BGTFW_SCRIPT_DEBUG' ) && BGTFW_SCRIPT_DEBUG;

		if ( $webpack_server_enabled ) {
			$path = str_replace( $this->configs['framework']['root_uri'],
				$this->configs['framework']['webpack_server'], $path );
		}

		return $path . $file;
	}
}
