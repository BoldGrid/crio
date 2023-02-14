<?php
/**
 * The core template of a BoldGrid theme.  If there's no home template
 * then this template gets used.  One of two required WordPress files.
 *
 * @since 2.0
 *
 * @package Crio
 */

if ( ! have_posts() ) {
	get_template_part( 'templates/content', 'none' );
}

if ( ( is_home() || is_archive() ) && 'above' === get_theme_mod( 'bgtfw_global_title_position' ) ) {
	if ( have_posts() ) {
		echo '<div class="article-wrapper">';

		while ( have_posts() ) : the_post();
			get_template_part( 'templates/content', get_post_type() !== 'post' ? get_post_type() : get_post_format() );
		endwhile;

		boldgrid_paging_nav();

		/*
		 * Fires after the navigation links have been displayed.
		 *
		 * This hook is used to add additional content / functionality
		 * after the navigation links such as a "Back to Top" link or
		 * lazy loading of posts.
		 */
		do_action( 'boldgrid_after_paging_nav' );

		echo '</div>';

		if ( BoldGrid::display_sidebar() ) {
			include BoldGrid::boldgrid_sidebar_path();
		}
	}
} else {
	while ( have_posts() ) : the_post();
		get_template_part( 'templates/content', get_post_type() !== 'post' ? get_post_type() : get_post_format() );
	endwhile;
	boldgrid_paging_nav();
}
