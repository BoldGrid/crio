<?php
/**
 * Footer Template
 *
 * This file contains the markup for the footer template.
 *
 * @since 2.0
 * @package Crio
 */
$has_footer_template     = apply_filters( 'crio_premium_get_page_footer', get_the_ID() );
$has_footer_template     = get_the_ID() === $has_footer_template ? false : $has_footer_template;
$footer_content_classes  = array( 'bgtfw-footer', 'footer-content' );
$footer_colophon_classes = array( 'site-footer' );

if ( $has_footer_template ) {
	$footer_content_classes[]  = 'template-footer';
	$footer_colophon_classes[] = 'template-footer';
}

?>
<footer id="colophon" <?php BoldGrid::add_class( 'footer', $footer_colophon_classes ); ?> role="contentinfo" <?php BoldGrid_Framework_Schema::footer( true ); ?>>
	<?php do_action( 'boldgrid_footer_top' ); ?>
	<div <?php BoldGrid::add_class( 'footer_content', $footer_content_classes ); ?>>
		<?php echo BoldGrid::dynamic_footer(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
	<?php do_action( 'boldgrid_footer_bottom' ); ?>
</footer><!-- #colophon -->
