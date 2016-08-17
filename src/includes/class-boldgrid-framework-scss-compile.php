<?php
/**
 * Class: Boldgrid_Framework_SCSS
 *
 * Functions for interfacing with Leafo\ScssPhp\Compiler
 *
 * @since      1.0.0
 * @package    Boldgrid_Framework
 * @subpackage Boldgrid_Framework_SCSS
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

use Leafo\ScssPhp\Compiler;

/**
 * Class: Boldgrid_Framework_Bootstrap_Compile
 *
 * Functions for interfacing with Leafo\ScssPhp\Compiler
 *
 * @since      1.0.0
 */
class Boldgrid_Framework_Scss_Compile implements Boldgrid_Framework_Compile {

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
		$this->colors  = new Boldgrid_Framework_Compile_Colors( $this->configs );
		$this->wpfs    = new Boldgrid_Framework_Wp_Fs();
	}

	/**
	 * Build Bootstrap from SCSS.
	 *
	 * Calls to compile bootstrap, and then save it.
	 *
	 * @since 1.1
	 */
	public function build() {
		$this->build_bootstrap();
		$this->build_bgtfw();
	}

	public function build_bootstrap() {
		$dir = $this->configs['framework']['asset_dir'];
		$variables = array();
		if ( $this->configs['bootstrap'] ) {
			// BoldGrid specific variables to have available during compile.
			$color_variables = $this->colors->get_scss_variables();
			// Variables to assign before compile.
			$variables = array_merge( $color_variables, $this->configs['bootstrap'] );
		}
		$css = $this->compile( $dir . 'scss/', '@import "bootstrap";', $variables );
		$this->wpfs->save( $css, $dir . 'css/bootstrap/bootstrap.min.css' );
	}

	public function build_bgtfw() {
		$dir = $this->configs['framework']['asset_dir'];
		$variables = array();
		// BoldGrid specific variables to have available during compile.
		$color_variables = $this->colors->get_scss_variables();
		// Variables to assign before compile.
		$variables = array_merge( $color_variables, $this->configs['components']['buttons']['variables'] );
		// Compile.
		$css = $this->compile( $dir . 'scss/', '@import "boldgrid-theme-framework";', $variables );
		// Save.
		$this->wpfs->save( $css, $dir . 'css/boldgrid-theme-framework.css' );
	}

	/**
	 * Compile Bootstrap SCSS to CSS.
	 *
	 * @since 1.1
	 * @return string $compiled_scss Contains compiled SCSS code.
	 */
	public function compile( $path, $content, $variables ) {
		if ( ! class_exists( '\Leafo\ScssPhp\Compiler' ) ) {
			require_once $this->configs['framework']['includes_dir'] . '/scssphp/scss.inc.php';
		}
		$scss = new Compiler();
		$path = $this->configs['framework']['asset_dir'] . 'scss/';
		$scss->setImportPaths( $path );
		$scss->setVariables( $variables );
		$compiled_scss = $scss->compile( $content );
		return $compiled_scss;
	}
}
