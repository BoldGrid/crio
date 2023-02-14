<?php
/**
 * Entry Header Header Below Template
 *
 * This file contains the markup for a single post with feat img inside the post content.
 *
 * @package Crio
 */
do_action( 'boldgrid_before_entry_title' );
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
	</header><!-- .entry-header -->
</div>
<?php do_action( 'boldgrid_after_entry_title' ); ?>
