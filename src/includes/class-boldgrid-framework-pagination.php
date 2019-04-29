<?php
/**
 * Class: BoldGrid_Framework_Pagination
 *
 * This is the primary class that provides the customized
 * pagination lists used throughout the framework.
 *
 * @since      1.4.1
 * @package    Boldgrid_Framework
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: BoldGrid_Framework_Pagination
 *
 * This is the primary class that provides the customized
 * pagination lists used throughout the framework.
 *
 * @since      1.4.1
 */
class BoldGrid_Framework_Pagination {

	/**
	 * Creates our custom pagination markup to use.
	 *
	 * @global $wp_query WordPress query global.
	 */
	public function create() {
		global $wp_query;
		$big = 999999999;
		$pages = paginate_links(
			array(
				'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
				'format' => '?page=%#%',
				'current' => max( 1, get_query_var( 'paged' ) ),
				'total' => $wp_query->max_num_pages,
				'type' => 'array',
				'prev_next' => true,
				'prev_text' => '&larr; Previous',
				'next_text' => 'Next &rarr;',
			)
		);
		$output = '';
		if ( is_array( $pages ) ) {
			$paged = ( get_query_var( 'paged' ) === 0 ) ? 1 : get_query_var( 'paged' );

			$output .= '<ul class="pagination">';

			foreach ( $pages as $i => $page ) {
				if ( 1 === $paged && 0 === $i ) {
					$output .= '<li class="active">' . $page . '</li>';
				} else {
					if ( 1 !== $paged && $i === $paged ) {
						$output .= '<li class="active">' . $page . '</li>';
					} else {
						$output .= '<li>' . $page . '</li>';
					}
				}
			}

			$output .= '</ul>';

			// Create an instance of DOMDocument
			$dom = new \DOMDocument();

			// Handle UTF-8, otherwise problems will occur with UTF-8 characters.
			$dom->loadHTML( mb_convert_encoding( $output, 'HTML-ENTITIES', 'UTF-8' ) );

			// Create an instance of DOMXpath and all elements with the class 'page-numbers'
			$xpath = new \DOMXpath( $dom );
			$page_numbers = $xpath->query( "//*[contains(concat(' ', normalize-space(@class), ' '), ' page-numbers ')]" );

			// Iterate over the $page_numbers node.
			foreach ( $page_numbers as $page_numbers_item ) {
				if ( strpos( $page_numbers_item->getAttribute( 'class' ), 'current' ) !== false ) {
					$page_numbers_item->setAttribute( 'class', 'page-numbers color2-background-color color1-border-color color-2-text-contrast' );
				} else if ( 'span' === $page_numbers_item->nodeName ) { //phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
					$page_numbers_item->setAttribute( 'class', 'page-numbers color1-background-color color1-border-color color-1-text-contrast' );
				} else {
					$page_numbers_item->setAttribute( 'class', 'page-numbers color1-background-color color1-border-color color-1-text-contrast color2-background-color-hover color-2-text-contrast-hover' );
				}
			}

			// Save the updated HTML and output it.
			$output = $dom->saveHTML();
		}

		$allowed = [
			'ul' => [ 'class' => [] ],
			'li' => [ 'class' => [] ],
			'a' => [
				'class' => [],
				'href' => [],
			],
			'span' => [
				'class' => [],
				'aria-current' => [],
			],
		];

		echo wp_kses( $output, $allowed );
	}

	/**
	 * Creates our custom pagination markup to use for comment pagination.
	 *
	 * @since 2.0.0
	 *
	 * @global $wp_rewrite WordPress rewrite global.
	 *
	 * @param array $args Arguments to pass to paginate_links().
	 */
	public function comments( $args = array() ) {
		global $wp_rewrite;

		if ( ! is_singular() ) {
			return;
		}

		$max_page = get_comment_pages_count();

		$defaults = array(
			'base' => add_query_arg( 'cpage', '%#%' ),
			'format' => '',
			'type' => 'array',
			'total' => $max_page,
			'current' => max( 1, get_query_var( 'cpage' ) ),
			'echo' => true,
			'add_fragment' => '#comments',
		);

		if ( $wp_rewrite->using_permalinks() ) {
			$defaults['base'] = user_trailingslashit( trailingslashit( get_permalink() ) . $wp_rewrite->comments_pagination_base . '-%#%', 'commentpaged' );
		}

		$args = wp_parse_args( $args, $defaults );
		$pages = paginate_links( $args );

		$output = '';

		if ( is_array( $pages ) ) {
			$paged = absint( ( get_query_var( 'cpage' ) === 0 ) ? 1 : get_query_var( 'cpage' ) );

			$output .= '<ul class="pagination">';

			foreach ( $pages as $i => $page ) {
				if ( 1 === $paged && 0 === $i ) {
					$output .= '<li class="active">' . $page . '</li>';
				} else {
					if ( 1 !== $paged && $i === $paged ) {
						$output .= '<li class="active">' . $page . '</li>';
					} else {
						$output .= '<li>' . $page . '</li>';
					}
				}
			}

			$output .= '</ul>';

			// Create an instance of DOMDocument
			$dom = new \DOMDocument();

			// Handle UTF-8, otherwise problems will occur with UTF-8 characters.
			$dom->loadHTML( mb_convert_encoding( $output, 'HTML-ENTITIES', 'UTF-8' ) );

			// Create an instance of DOMXpath and all elements with the class 'page-numbers'
			$xpath = new \DOMXpath( $dom );
			$page_numbers = $xpath->query( "//*[contains(concat(' ', normalize-space(@class), ' '), ' page-numbers ')]" );

			// Iterate over the $page_numbers node.
			foreach ( $page_numbers as $page_numbers_item ) {
				if ( strpos( $page_numbers_item->getAttribute( 'class' ), 'current' ) !== false ) {
					$page_numbers_item->setAttribute( 'class', 'page-numbers color2-background-color color1-border-color color-2-text-contrast' );
				} else if ( 'span' === $page_numbers_item->nodeName ) { //phpcs:ignore WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
					$page_numbers_item->setAttribute( 'class', 'page-numbers color1-background-color color1-border-color color-1-text-contrast' );
				} else {
					$page_numbers_item->setAttribute( 'class', 'page-numbers color1-background-color color1-border-color color-1-text-contrast color2-background-color-hover color-2-text-contrast-hover' );
				}
			}

			// Save the updated HTML and output it.
			$output = $dom->saveHTML();
		}

		$allowed = [
			'ul' => [ 'class' => [] ],
			'li' => [ 'class' => [] ],
			'a' => [
				'class' => [],
				'href' => [],
			],
			'span' => [
				'class' => [],
				'aria-current' => [],
			],
		];

		if ( $args['echo'] ) {
			printf( wp_kses( $output, $allowed ) );
		} else {
			return wp_kses( $output, $allowed );
		}
	}
}
