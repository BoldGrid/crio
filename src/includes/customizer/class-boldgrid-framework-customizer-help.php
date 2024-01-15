<?php
/**
 * Class: BoldGrid_Framework_Customizer_Help
 *
 * This is used for the control help video functionality in the WordPress customizer.
 *
 * @since      2.22.0
 * @category   Customizer
 * @package    Boldgrid_Framework
 * @subpackage Boldgrid_Framework_Customizer
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * BoldGrid_Framework_Customizer_Help
 *
 * Responsible for the search functionality in the WordPress customizer.
 *
 * @since 2.22.0
 */
class Boldgrid_Framework_Customizer_Help {

	/**
	 * The BoldGrid Theme Framework configurations.
	 *
	 * @since     2.22.0
	 * @access    protected
	 * @var       string     $configs       The BoldGrid Theme Framework configurations.
	 */
	protected $configs;

	/**
	 * Onboarding Videos
	 *
	 * @since  2.22.0
	 * @access private
	 * @var    array $onboarding_videos Onboarding Videos
	 */
	private $onboarding_videos;

	/**
	 * Nonce
	 *
	 * @since  2.22.0
	 * @access private
	 * @var    string $nonce Nonce
	 */
	private $nonce;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param     string $configs       The BoldGrid Theme Framework configurations.
	 * @since     2.20.0
	 */
	public function __construct( $configs ) {
		$this->configs = $configs;

		$this->onboarding_videos = $this->get_onboarding_videos();

		$this->nonce = wp_create_nonce( 'boldgrid_framework_customizer_dismiss_help' );
	}

	/**
	 * Admin Ajax call to dismiss the onboarding video notice.
	 *
	 * @since 1.26.0
	 */
	public function ajax_dismiss_videos() {
		$nonce_check = check_ajax_referer( 'boldgrid_framework_customizer_dismiss_help', 'nonce', false );

		if ( ! current_user_can( 'edit_theme_options' ) ) {

			wp_die( esc_html__( 'Error: WordPress security violation.', 'crio' ) );
		}

		if ( 1 !== $nonce_check ) {
			wp_die( esc_html__( 'Error: WordPress security violation.', 'crio' ) );
		}

		update_option( 'boldgrid_framework_customizer_dismiss_help', true );

		wp_send_json_success();
	}

	/**
	 * Get Onboarding Videos
	 *
	 * @since 2.22.0
	 *
	 * @return array Onboarding Videos
	 */
	public static function get_onboarding_videos() {
		$onb_videos     = get_option( 'boldgrid_onboarding_videos', array() );
		$crio_onb_vidos = array();

		// @codingStandardsIgnoreStart
		foreach ( $onb_videos as $key => $video ) {
			if ( 'crio' === $video->Plugin ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
				$crio_onb_vidos[] = $video;
			}
		}

		if ( 0 !== count( $crio_onb_vidos ) ) {
			usort(
				$crio_onb_vidos,
				function( $a, $b ) {
					return $a->DisplayOrder - $b->DisplayOrder; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
				}
			);
		}
		// @codingStandardsIgnoreEnd

		return $crio_onb_vidos;
	}

	/**
	 * Auto Display Videos
	 *
	 * Determines whether or not the videos modal should be displayed
	 * automatically when opening the customizer based on whether the user
	 * has dismissed the videos modal.
	 *
	 * @since 2.22.0
	 *
	 * @return bool Auto Display Videos
	 */
	public function auto_display_videos() {
		$dismissed = get_option( 'boldgrid_framework_customizer_dismiss_help', false );

		if ( false === $dismissed ) {
			return true;
		}

		return false;
	}

	/**
	 * Enqueue scripts in customizer.
	 *
	 * @since 2.20.0
	 */
	public function enqueue() {

		if ( 0 === count( $this->onboarding_videos ) ) {
			return;
		}

		// Minify if script debug is off.
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_register_script(
			'bgtfw-customizer-help-js',
			$this->configs['framework']['js_dir'] . 'customizer/help' . $suffix . '.js',
			array(),
			$this->configs['version'],
			true
		);

		wp_localize_script(
			'bgtfw-customizer-help-js',
			'CrioCustomizerHelp',
			array(
				'autoDisplayVideos' => $this->auto_display_videos(),
			)
		);

		wp_enqueue_script(
			'bgtfw-customizer-help-js',
			$this->configs['framework']['js_dir'] . 'customizer/help' . $suffix . '.js',
			array(),
			$this->configs['version'],
			true
		);
	}

	/**
	 * Get the video list.
	 *
	 * @since 2.20.0
	 */
	public function get_video_list() {
		$video_list = '';

		if ( 0 !== count( $this->onboarding_videos ) ) {
			$video_list .= '<ul class="onb-videos-list">';
			foreach ( $this->onboarding_videos as $video ) {
				$video_list .= '<li class="onb-video-list-item">';
				$video_list .= '<span data-video-id="';
				// @codingStandardsIgnoreStart
				$video_list .= $video->VideoId; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
				$video_list .= '" class="button button-secondary">';
				$video_list .= $video->Title; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
				// @codingStandardsIgnoreEnd
				$video_list .= '</span>';
				$video_list .= '</li>';
			}
			$video_list .= '</ul>';
		}

		return $video_list;
	}

	/**
	 * Get the video embed.
	 *
	 * @since 2.20.0
	 */
	public function print_video_embed() {
		$videos = $this->get_onboarding_videos();

		if ( 0 !== count( $videos ) ) {
			?>
			<div class="onb-active-video">
				<iframe 
					width="577"
					height="325"
					src="https://www.youtube.com/embed/<?php echo esc_attr( $videos[0]->VideoId ); ?>"
					frameborder="0"
					allowfullscreen>
				</iframe>
			</div>
			<?php
		}
	}

	/**
	 * Print template for the "Customizer Search" functionality.
	 *
	 * @since 2.20.0
	 */
	public function print_templates() {
		?>
		<script type="text/html" id="tmpl-help-button">
			<button type="button" class="customize-help-modal-toggle dashicons dashicons-video-alt2" aria-expanded="false"><span class="screen-reader-text"><?php esc_html_e( 'Help', 'crio' ); ?></span></button>
		</script>
		<script type="text/html" id="tmpl-help-modal-pointer">
			<h3><?php esc_html_e( 'Tutorial Videos', 'crio' ); ?></h3>
			<p><?php esc_html_e( 'You can open up the tutorial videos again by clicking here', 'crio' ); ?></p>
		</script>
		<script type="text/html" id="tmpl-help-modal">
			<div id="customizer-help-modal" style="display: none;">
				<div class="help-modal-title">
					<span class="name"><?php esc_html_e( 'BoldGrid Crio - Getting Started', 'crio' ); ?></span>
					<span data-nonce="<?php echo esc_attr( $this->nonce ); ?>" class="dashicons dashicons-no-alt close-icon"></span>
				</div>
				<div class="help-modal-header">
					<h3 class="help-modal-header-text">
						<?php esc_html_e( 'For help getting started with Crio, you can watch these tutorial videos for help', 'crio' ); ?> 
					</h3>
				</div>
				<div class="help-modal-content">
					<div class="onb-videos-list-container">
						<?php echo wp_kses_post( $this->get_video_list() ); ?>
					</div>
					<div class="onb-active-video-container">
						<?php $this->print_video_embed(); ?>
					</div>
				</div>
		</script>
		<?php
	}
}
