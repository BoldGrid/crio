<?php
/**
 * File: class-boldgrid-framework-comments.php
 *
 * The class responsible for comment display.
 *
 * @since      1.0.0
 * @package    Boldgrid_Framework
 * @subpackage Boldgrid_Framework/comments
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: BoldGrid Comments
 *
 * The class responsible for the comments display in a bgtfw theme.
 *
 * @since 1.0.0
 */
class BoldGrid_Framework_Comments {

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
	 * BoldGrid Comments
	 *
	 * This tells wp_list_comments to use our custom callback, and also is
	 * providing the template and bootstrap styling for comments and comment
	 * forms.  Some of the styles do get applied with javascript in the
	 * boldgrid-bootstrap-shim.js file.
	 *
	 * @since 1.0.0
	 */
	public function boldgrid_comments() {
		if ( have_comments( ) ) : ?>
			<header>
				<h2 class="comments-title">

					<?php
						$comments_number = get_comments_number();
						if ( 1 === $comments_number ) {
							printf(
								/* translators: %s: comments title */
								esc_html_x( 'One thought on &ldquo;%s&rdquo;', 'comments title', 'crio' ),
								'<span>' . esc_html( get_the_title() ) . '</span>'
							);
						} else {
							printf(
								/* translators: 1: number of comments, 2: post title */
								esc_html( _nx(
									'%1$s thought on &ldquo;%2$s&rdquo;',
									'%1$s thoughts on &ldquo;%2$s&rdquo;',
									$comments_number,
									'comments title',
									'crio'
								) ),
								esc_html( number_format_i18n( $comments_number ) ),
								'<span>' . esc_html( get_the_title() ) . '</span>'
							);
						}
					?>
				</h2>
			</header>

			<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
			<div id="comment-nav-above" class="comment-navigation" role="navigation">
				<?php
					$paginate = new BoldGrid_Framework_Pagination();
					$paginate->comments();
				?>
			</div><!-- #comment-nav-above -->
			<?php endif; // end comment navigation ?>

			<ol class="comment-list">
				<?php
					/**
					 * Loop through and list the comments. Tell wp_list_comments()
					 * to use boldgrid_bootstrap_comment(  ) to format the comments.
					 * If you want to overload this in a child theme then you can
					 * define boldgrid_bootstrap_comment(  ) and that will be used instead.
					 */
					wp_list_comments(
						array(
							'callback' => array( $this, 'boldgrid_bootstrap_comment' ),
							'avatar_size' => 50,
						)
					);
				?>
			</ol><!-- .comment-list -->

			<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
			<div id="comment-nav-below" class="comment-navigation">
				<?php
					$paginate = new BoldGrid_Framework_Pagination();
					$paginate->comments();
				?>
			</div><!-- #comment-nav-below -->
			<?php endif; // check for comment navigation ?>

		<?php endif; // have_comments() ?>

		<?php
			// If comments are closed and there are comments.
			if ( ! comments_open()
					&& '0' != get_comments_number()
					&& post_type_supports( get_post_type(), 'comments' ) ) :
			?>
			<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'crio' ); ?></p>
		<?php endif; ?>

		<?php comment_form( apply_filters( 'comment_form_defaults', $args = array(
			'id_form'           => 'commentform',
			'id_submit'         => 'commentsubmit',
			'title_reply'       => __( 'Leave a Reply', 'crio' ),
			/* translators: %s: the author of the comment being replied to */
			'title_reply_to'    => __( 'Leave a Reply to %s', 'crio' ),
			'cancel_reply_link' => __( 'Cancel Reply', 'crio' ),
			'label_submit'      => __( 'Post Comment', 'crio' ),
			'class_submit' => 'button-primary',
			'comment_field' => '<p><textarea placeholder="Start typing..." id="comment" class="form-control" name="comment" cols="45" rows="8" aria-required="true"></textarea></p>',
			'comment_notes_after' => '<p class="form-allowed-tags">' .
			__( 'You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes:', 'crio' ) .
			'</p><div class="alert alert-info">' . allowed_tags() . '</div>',
		) ) );
	}

	/**
	 * Filter Color Value
	 *
	 * Filter old color value formats for comments
	 *
	 * @since 2.19.0
	 *
	 * @param string $value The color value.
	 *
	 * @return string The color value.
	 */
	public function filter_color_value( $value ) {
		if ( false !== strpos( $value, ':' ) ) {
			$value = explode( ':', $value );
			$value = $value[0];
		}

		return $value;
	}

	/**
	 * Get Color Classes
	 *
	 * @since 2.19.0
	 *
	 * @param string $section The section of the comments element.
	 * @param string $default The default bg color.
	 */
	public function get_color_classes( $section, $default ) {
		$link_color = get_theme_mod( 'bgtfw_comments_' . $section . '_links', get_theme_mod( 'bgtfw_body_link_color', 'color-1' ) );
		$link_color = $this->filter_color_value( $link_color );
		$link_color = $link_color . '-link-color';

		$bg_color = get_theme_mod( 'bgtfw_comments_' . $section . '_background', $default );
		$bg_color = $this->filter_color_value( $bg_color );
		$color    = $bg_color . '-text-contrast';
		$bg_color = 'color-neutral' === $bg_color ?
			$bg_color . '-background' :
			str_replace( '-', '', $bg_color ) . '-background';

		return implode( ' ', array( $bg_color, $color, $link_color ) );
	}

	/**
	 * Get bootstrap formatted comment
	 *
	 * This is the BoldGrid Bootstrap template for comments and pingbacks.
	 *
	 * Used as a callback by wp_list_comments(  ) for displaying the comments.
	 *
	 * @since 1.0.0
	 */
	public function boldgrid_bootstrap_comment( $comment, $args, $depth ) {
		$heading_color_classes = $this->get_color_classes( 'header', 'color-2' );
		$body_color_classes    = $this->get_color_classes( 'body', 'color-neutral' );
		$footer_color_classes  = $this->get_color_classes( 'footer', 'color-2' );

		$avatar_display = get_theme_mod( 'bgtfw_comments_avatar_display', 'pull-left' );

		if ( 'pingback' == $comment->comment_type || 'trackback' == $comment->comment_type ) : ?>

		<li id="comment-<?php comment_ID(); ?>" <?php comment_class( 'media' ); ?>>
			<div class="comment-body">
				<?php esc_html_e( 'Pingback:', 'crio' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( 'Edit', 'crio' ), '<span class="edit-link">', '</span>' ); ?>
			</div>
		<?php else : ?>
		<li id="comment-<?php comment_ID(); ?>"
			<?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
			<article id="div-comment-<?php comment_ID(); ?>" class="comment-body media">
				<?php if ( 'pull-left' === $avatar_display || 'pull-right' === $avatar_display ) : ?>
					<a class="avatar <?php echo esc_attr( $avatar_display ); ?>" href="#">
						<?php if ( 0 != $args['avatar_size'] ) { echo get_avatar( $comment, $args['avatar_size'] ); } ?>
					</a>
				<?php endif; ?>
				<div class="media-body">
					<div class="media-body-wrap panel panel-default">
						<div class="panel-heading <?php echo esc_attr( $heading_color_classes ); ?>"
							<?php echo ( 'inside' === $avatar_display ) ? 'style="min-height: 70px;"' : ''; ?>>
							<div class="media-heading">
							<?php if ( 'inside' === $avatar_display ) : ?>
							<a class="avatar pull-left" href="#">
								<?php if ( 0 != $args['avatar_size'] ) { echo get_avatar( $comment, $args['avatar_size'] ); } ?>
							</a>
							<?php endif; ?>
							<?php
								printf(
									'<cite class="fn">%1$s</cite> <span class="says">%2$s:</span>',
									get_comment_author_link(),
									/* translators: this displays as $author says: */
									esc_html__( 'says', 'crio' )
								);
							?>
							</div>
							<div class="comment-meta">
								<?php if ( get_theme_mod( 'bgtfw_comments_date_display', true ) ) : ?>
								<a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>">
									<time datetime="<?php esc_attr( comment_time( 'c' ) ); ?>">
									<?php
										/* translators: 1: date of comment, 2: time of comment */
										printf( esc_html_x( '%1$s at %2$s', '1: date, 2: time', 'crio' ), esc_html( get_comment_date() ), esc_html( get_comment_time() ) );
									?>
									</time>
								</a>
								<?php endif; ?>
								<?php edit_comment_link( __( '<span style="margin-left: 5px;" class="fa fa-edit"></span> Edit', 'crio' ), '<span class="edit-link">', '</span>' ); ?>
							</div>
						</div>
						<?php if ( '0' == $comment->comment_approved ) : ?>
							<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'crio' ); ?></p>
						<?php endif; ?>
						<div class="comment-content panel-body <?php echo esc_attr( $body_color_classes ); ?>">
							<?php comment_text(); ?>
						</div><!-- .comment-content -->
						<?php
						$comment_reply_link = get_comment_reply_link(
							array_merge(
								$args,
								array(
									'add_below' => 'div-comment',
									'depth'     => $depth,
									'max_depth' => $args['max_depth'],
									'before'    => '<footer class="reply comment-reply panel-footer ' . $footer_color_classes . '">',
									'after'     => '</footer><!-- .reply -->',
								)
							),
						);

						$button_class = get_theme_mod( 'bgtfw_comment_reply_button_class', 'button-primary' );
						$classes      = apply_filters( 'bgtfw_button_classes', array() );

						$comment_reply_link = $comment_reply_link ? $comment_reply_link : '';

						if ( isset( $classes[ $button_class ] ) ) {
							$comment_reply_link = preg_replace(
								'/comment-reply-link/',
								'comment-reply-link ' . $button_class . ' ' . $classes[ $button_class ],
								$comment_reply_link
							);
						}

						echo wp_kses_post( $comment_reply_link );
						?>
					</div><!-- .panel -->
				</div><!-- .media-body -->
			</article> <!-- .comment-body -->
		<?php
		endif;
	}
}
