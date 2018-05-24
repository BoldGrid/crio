<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php get_template_part( 'templates/entry-header' ); ?>
	<div class="entry-summary">
		<?php the_excerpt(); ?>
	</div><!-- .entry-summary -->
	<footer class="entry-footer">
		<?php boldgrid_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
