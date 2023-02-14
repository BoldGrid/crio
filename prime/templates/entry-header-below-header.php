<?php
/**
 * Entry Header Header Below Template
 *
 * This file contains the markup for a single post with the feat image below the header information.
 *
 * @package Crio
 */
do_action( 'boldgrid_before_entry_title' );
$feat_image_type = get_theme_mod( 'bgtfw_post_header_feat_image_type', 'background' );
?>
<div <?php BoldGrid::add_class( 'page_header_wrapper', array( 'page-header-wrapper' ) ); ?>>
	<header <?php BoldGrid::add_class( 'single_page_title', array( 'entry-header', 'page-header', 'below', 'has-featured-image-header' ) ); ?>>
		<div <?php BoldGrid::add_class( 'featured_image', array( 'featured-imgage-header' ) ); ?>>
			<?php
			echo wp_kses_post(
				sprintf(
					// translators: %1$s is the element type, %2$s is the class string, %3$s is the title.
					'<%1$s %2$s>%3$s</%1$s>',
					apply_filters( 'bgtfw_entry_title_element', 'p' ),
					BoldGrid::add_class(
						'pages_title',
						array( 'entry-title', 'page-title', get_theme_mod( 'bgtfw_global_title_size' ) ),
						false
					),
					get_the_title()
				)
			);
			?>
			<?php if ( 'post' === get_post_type() ) : ?>
				<div class="entry-meta">
					<?php boldgrid_posted_on(); ?>
				</div><!-- .entry-meta -->
			<?php endif; ?>
		</div>
		<?php if ( 'show' === get_theme_mod( 'bgtfw_post_header_feat_image_display' ) ) : ?>
		<div
		<?php
		if ( 'background' === $feat_image_type ) {
			$classes = 'featured-imgage-header has-feat-image-bg';
			if ( 'contained' === get_theme_mod( 'bgtfw_global_title_background_container' ) ) {
				$classes .= ' container';
			}
			$styles = 'background-image: url(' . esc_url( get_the_post_thumbnail_url() ) . '); background-size: cover; background-position: center center;';
			echo ' class="' . esc_attr( $classes ) . '" style="' . esc_attr( $styles ) . '"';
		} else {
			BoldGrid::add_class( 'featured_image', array( 'featured-imgage-header', 'img' ) );
		}
		?>
		>
			<?php

			if ( 'image' === $feat_image_type ) {
				echo get_the_post_thumbnail(
					null,
					get_theme_mod( 'bgtfw_post_header_feat_image_size' ),
					array( 'class' => get_theme_mod( 'bgtfw_post_header_feat_image_align' ) )
				);
			}
			?>
		</div>
		<?php endif; ?>
	</header><!-- .entry-header -->
</div>
<?php do_action( 'boldgrid_after_entry_title' ); ?>
