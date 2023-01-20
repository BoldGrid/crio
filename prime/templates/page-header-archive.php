<?php
/**
 * Archive Page Entry Header Template
 *
 * This file contains the markup for the archive page's entry header.
 *
 * @package Crio
 */
?>
<div <?php BoldGrid::add_class( 'page_header_wrapper', [ 'page-header-wrapper' ] ); ?>>
	<header <?php BoldGrid::add_class( 'archive_page_title', [ 'page-header' ] ); ?>>
		<div <?php BoldGrid::add_class( 'featured_image', [ 'featured-imgage-header' ] ); ?>>
			<?php
				echo wp_kses_post(
					sprintf(
						// translators: %1$s is the element type, %2$s is the class string, %3$s is the title.
						'<%1$s %2$s>%3$s</%1$s>',
						apply_filters( 'bgtfw_archive_title_element', 'h1' ),
						BoldGrid::add_class(
							'pages_title',
							array( 'page-title', esc_attr( get_theme_mod( 'bgtfw_global_title_size' ) ) ),
							false
						),
						get_the_archive_title()
					)
				);

				wp_kses_post( the_archive_description( '<div class="taxonomy-description">', '</div>' ) );
			?>
		</div>
	</header>
</div>
