<?php
/**
 * Page Entry Header
 *
 * This file contains the markup for page entry headers.
 *
 * @package Crio
 */
do_action( 'boldgrid_before_entry_title' ); ?>
<div <?php BoldGrid::add_class( 'page_header_wrapper', [ 'page-header-wrapper' ] ); ?>>
	<header <?php BoldGrid::add_class( 'page_page_title', [ 'entry-header', 'page-header', has_post_thumbnail( get_option( 'page_for_posts', true ) ) ? 'has-featured-image-header' : '' ] ); ?> <?php bgtfw_featured_img_bg( $post->ID ); ?>>
		<div <?php BoldGrid::add_class( 'featured_image_page', [ 'featured-imgage-header' ] ); ?>>
			<?php
			echo wp_kses_post(
				sprintf(
					// translators: %1$s is the element type, %2$s is the class string, %3$s is the title.
					'<%1$s %2$s>%3$s</%1$s>',
					apply_filters( 'bgtfw_page_title_element', 'p' ),
					BoldGrid::add_class(
						'pages_title',
						array( 'entry-title', 'page-title', get_theme_mod( 'bgtfw_global_title_size' ) ),
						false
					),
					get_the_title()
				)
			);
			?>
			<?php if ( 'post' == get_post_type() ) : ?>
			<div class="entry-meta">
				<?php boldgrid_posted_on(); ?>
			</div><!-- .entry-meta -->
			<?php endif; ?>
		</div>
	</header><!-- .entry-header -->
</div>
<?php do_action( 'boldgrid_after_entry_title' ); ?>
