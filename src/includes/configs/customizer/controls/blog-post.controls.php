<?php
/**
 * Customizer Controls Configs.
 *
 * @package Boldgrid_Theme_Framework
 * @subpackage Boldgrid_Theme_Framework\Configs\Customizer\Controls
 *
 * @since 2.0.0
 *
 * @return array Controls to create in the WordPress Customizer.
 */

return array(
	'bgtfw_posts_tags_display'                  => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_posts_tags_display',
		'label'             => esc_attr__( 'Display', 'crio' ),
		'tooltip'           => __( 'Toggle the display of your tags on the blog roll and archive pages.', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'block',
		'choices'           => array(
			'block' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'none'  => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'block', 'none' ), true ) ? $value : $settings->default;
		},
		'output'            => array(
			array(
				'element'  => '.single .entry-footer .tags-links',
				'property' => 'display',
			),
		),
	),

	// Start: Posts Tags Links Color Controls.
	'bgtfw_posts_tags_link_color_display'       => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_tags_link_color_display',
		'label'             => esc_attr__( 'Colors', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'inherit',
		'choices'           => array(
			'inherit' => '<span class="dashicons dashicons-admin-site"></span>' . __( 'Global Color', 'crio' ),
			'custom'  => '<span class="dashicons dashicons-admin-customizer"></span>' . __( 'Custom', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'inherit', 'custom' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_tags_link_color'               => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_tags_link_color',
		'label'             => esc_attr__( 'Link Color', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'color-1',
		'choices'           => array(
			'selectors' => array( '.single .entry-footer .tags-links a' ),
			'colors'    => $bgtfw_formatted_palette,
			'size'      => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_tags_link_decoration'          => array(
		'settings'          => 'bgtfw_posts_tags_link_decoration',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'Normal', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_tags_link_color_hover'         => array(
		'type'            => 'slider',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_tags_link_color_hover',
		'label'           => esc_attr__( 'Hover Color Brightness', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_tags_links',
		'default'         => -25,
		'choices'         => array(
			'min'  => '-25',
			'max'  => '25',
			'step' => '1',
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_tags_decoration_hover'         => array(
		'settings'          => 'bgtfw_posts_tags_link_decoration_hover',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Hover Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'None', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),

	// Start Tag Icons.
	'bgtfw_posts_tags_icon_display'             => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_posts_tags_icon_display',
		'label'             => esc_attr__( 'Icon Display', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_tags_links',
		'default'           => 'inline-block',
		'choices'           => array(
			'inline-block' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'none'         => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'inline-block', 'none' ), true ) ? $value : $settings->default;
		},
		'output'            => array(
			array(
				'element'  => '.single .entry-footer .tags-links .fa',
				'property' => 'display',
			),
		),
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_tag_icon'                      => array(
		'type'            => 'fontawesome',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_tag_icon',
		'label'           => esc_attr__( 'Single Tag Icon', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_tags_links',
		'default'         => 'hashtag',
		'js_vars'         => array(
			array(
				'element'       => '.single .tags-links.singular .fa',
				'function'      => 'html',
				'attr'          => 'class',
				'value_pattern' => 'fa fa-fw fa-$',
			),
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_icon_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_tags_icon'                     => array(
		'type'            => 'fontawesome',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_tags_icon',
		'label'           => esc_attr__( 'Multiple Tags Icon', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_tags_links',
		'default'         => 'hashtag',
		'js_vars'         => array(
			array(
				'element'       => '.single .tags-links.multiple .fa',
				'function'      => 'html',
				'attr'          => 'class',
				'value_pattern' => 'fa fa-fw fa-$',
			),
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_tags_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_tags_icon_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),

	'bgtfw_posts_cats_display'                  => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_posts_cats_display',
		'label'             => esc_attr__( 'Display', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'block',
		'choices'           => array(
			'block' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'none'  => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'block', 'none' ), true ) ? $value : $settings->default;
		},
		'output'            => array(
			array(
				'element'  => '.single .entry-footer .cat-links',
				'property' => 'display',
			),
		),
	),

	// Start: Posts Category Links Color Controls.
	'bgtfw_posts_cats_link_color_display'       => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_cats_link_color_display',
		'label'             => esc_attr__( 'Colors', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'inherit',
		'choices'           => array(
			'inherit' => '<span class="dashicons dashicons-admin-site"></span>' . __( 'Global Color', 'crio' ),
			'custom'  => '<span class="dashicons dashicons-admin-customizer"></span>' . __( 'Custom', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'inherit', 'custom' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_cats_link_color'               => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_cats_link_color',
		'label'             => esc_attr__( 'Link Color', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'color-1',
		'choices'           => array(
			'selectors' => array( '.single .entry-footer .cat-links a' ),
			'colors'    => $bgtfw_formatted_palette,
			'size'      => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_cats_link_decoration'          => array(
		'settings'          => 'bgtfw_posts_cats_link_decoration',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'Normal', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_cats_link_color_hover'         => array(
		'type'            => 'slider',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_cats_link_color_hover',
		'label'           => esc_attr__( 'Hover Color Brightness', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_cat_links',
		'default'         => -25,
		'choices'         => array(
			'min'  => '-25',
			'max'  => '25',
			'step' => '1',
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_cats_decoration_hover'         => array(
		'settings'          => 'bgtfw_posts_cats_link_decoration_hover',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Hover Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'None', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),

	// Start: Category Icons.
	'bgtfw_posts_cats_icon_display'             => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_posts_cats_icon_display',
		'label'             => esc_attr__( 'Icon Display', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_cat_links',
		'default'           => 'inline-block',
		'choices'           => array(
			'inline-block' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'none'         => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'inline-block', 'none' ), true ) ? $value : $settings->default;
		},
		'output'            => array(
			array(
				'element'  => '.single .entry-footer .cat-links .fa',
				'property' => 'display',
			),
		),
	),
	'bgtfw_posts_cat_icon'                      => array(
		'type'            => 'fontawesome',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_cat_icon',
		'label'           => esc_attr__( 'Single Category Icon', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_cat_links',
		'default'         => 'folder',
		'js_vars'         => array(
			array(
				'element'       => '.single .cat-links.singular .fa',
				'function'      => 'html',
				'attr'          => 'class',
				'value_pattern' => 'fa fa-fw fa-$',
			),
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_icon_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_cats_icon'                     => array(
		'type'            => 'fontawesome',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_cats_icon',
		'label'           => esc_attr__( 'Multiple Categories Icon', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_cat_links',
		'default'         => 'folder-open',
		'js_vars'         => array(
			array(
				'element'       => '.single .cat-links.multiple .fa',
				'function'      => 'html',
				'attr'          => 'class',
				'value_pattern' => 'fa fa-fw fa-$',
			),
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_cats_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_cats_icon_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),

	'bgtfw_posts_navigation_display'            => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_posts_navigation_display',
		'label'             => esc_attr__( 'Display', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_navigation_links',
		'default'           => 'flex',
		'choices'           => array(
			'flex' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'none' => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'flex', 'none' ), true ) ? $value : $settings->default;
		},
		'output'            => array(
			array(
				'element'  => '.single .post-navigation',
				'property' => 'display',
			),
		),
		'edit_vars'         => array(
			array(
				'selector'    => '.single .post-navigation',
				'label'       => __( 'Post Navigation Links', 'crio' ),
				'description' => __( 'Choose whether or not to display post navigation links', 'crio' ),
			),
		),
	),

	// Start: Posts Navigation Link Color Controls.
	'bgtfw_posts_navigation_link_color_display' => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_navigation_link_color_display',
		'label'             => esc_attr__( 'Colors', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_navigation_links',
		'default'           => 'inherit',
		'choices'           => array(
			'inherit' => '<span class="dashicons dashicons-admin-site"></span>' . __( 'Global Color', 'crio' ),
			'custom'  => '<span class="dashicons dashicons-admin-customizer"></span>' . __( 'Custom', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'inherit', 'custom' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_navigation_display',
				'operator' => '!==',
				'value'    => 'none',
			),
		),
	),
	'bgtfw_posts_navigation_link_color'         => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_posts_navigation_link_color',
		'label'             => esc_attr__( 'Link Color', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_navigation_links',
		'default'           => 'color-1',
		'choices'           => array(
			'selectors' => array( '.single .post-navigation a' ),
			'colors'    => $bgtfw_formatted_palette,
			'size'      => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_navigation_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_navigation_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_navigation_link_decoration'    => array(
		'settings'          => 'bgtfw_posts_navigation_link_decoration',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_navigation_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'Normal', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_navigation_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_navigation_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_navigation_link_color_hover'   => array(
		'type'            => 'slider',
		'transport'       => 'postMessage',
		'settings'        => 'bgtfw_posts_navigation_link_color_hover',
		'label'           => esc_attr__( 'Hover Color Brightness', 'crio' ),
		'section'         => 'bgtfw_pages_blog_posts_navigation_links',
		'default'         => -25,
		'choices'         => array(
			'min'  => '-25',
			'max'  => '25',
			'step' => '1',
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_posts_navigation_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_navigation_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_posts_navigation_decoration_hover'   => array(
		'settings'          => 'bgtfw_posts_navigation_link_decoration_hover',
		'transport'         => 'postMessage',
		'label'             => esc_html__( 'Hover Text Style', 'crio' ),
		'type'              => 'radio-buttonset',
		'section'           => 'bgtfw_pages_blog_posts_navigation_links',
		'default'           => 'none',
		'choices'           => array(
			'none'      => '<span class="dashicons dashicons-editor-textcolor"></span>' . __( 'None', 'crio' ),
			'underline' => '<span class="dashicons dashicons-editor-underline"></span>' . __( 'Underline', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'none', 'underline' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_posts_navigation_display',
				'operator' => '!==',
				'value'    => 'none',
			),
			array(
				'setting'  => 'bgtfw_posts_navigation_link_color_display',
				'operator' => '!==',
				'value'    => 'inherit',
			),
		),
	),
	'bgtfw_layout_blog'                         => array(
		'settings'          => 'bgtfw_layout_blog',
		'label'             => esc_html__( 'Sidebar Display', 'crio' ),
		'type'              => 'radio',
		'priority'          => 10,
		'default'           => 'no-sidebar',
		'choices'           => array(),
		'section'           => 'bgtfw_pages_blog_posts_sidebar',
		'sanitize_callback' => 'sanitize_html_class',
	),
	'bgtfw_post_header_feat_image_display'      => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_post_header_feat_image_display',
		'label'             => esc_attr__( 'Display', 'crio' ),
		'tooltip'           => __( 'Hide or show your featured image on your blog posts.', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => 'show',
		'choices'           => array(
			'show' => '<span class="dashicons dashicons-visibility"></span>' . __( 'Show', 'crio' ),
			'hide' => '<span class="dashicons dashicons-hidden"></span>' . __( 'Hide', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'show', 'hide' ), true ) ? $value : $settings->default;
		},
	),
	'bgtfw_post_header_feat_image_position'     => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_post_header_feat_image_position',
		'label'             => esc_attr__( 'Position', 'crio' ),
		'tooltip'           => __( 'Change where your featured image appears on your blog posts.', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => 'background',
		'choices'           => array(
			'background'   => '<span class="dashicons dashicons-format-image"></span>' . __( 'Header Background', 'crio' ),
			'above-header' => '<span class="dashicons dashicons-arrow-up-alt"></span>' . __( 'Above Header', 'crio' ),
			'below-header' => '<span class="dashicons dashicons-arrow-down-alt"></span>' . __( 'Below Header', 'crio' ),
			'below'        => '<span class="dashicons dashicons-format-aside"></span>' . __( 'In Post Content', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'background', 'above-header', 'below-header', 'below' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => array(
			array(
				'setting'  => 'bgtfw_post_header_feat_image_display',
				'operator' => '!==',
				'value'    => 'hide',
			),
		),
	),
	'bgtfw_post_header_feat_image_type'         => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'refresh',
		'settings'          => 'bgtfw_post_header_feat_image_type',
		'label'             => esc_attr__( 'Featured Image Display Type', 'crio' ),
		'tooltip'           => __( 'Choose whether the featured image should be inserted as an image or as the background of the row above or below the Post Title row', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => 'background',
		'choices'           => array(
			'background' => __( 'Background', 'crio' ),
			'image'      => __( 'Image', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'background', 'image' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => function() {
			if ( 'hide' === get_theme_mod( 'bgtfw_post_header_feat_image_display' ) ) {
				return false;
			}
			$feat_image_pos = get_theme_mod( 'bgtfw_post_header_feat_image_position' );
			return ( 'above-header' === $feat_image_pos || 'below-header' === $feat_image_pos );
		},
	),
	'bgtfw_post_header_feat_image_bg_height'    => array(
		'type'              => 'dimension',
		'settings'          => 'bgtfw_post_header_feat_image_bg_height',
		'label'             => esc_html__( 'Height', 'crio' ),
		'description'       => __( 'Enter the desired height of the background. The following units are acceptable: px, pt, em, rem, vh, vw', 'crio' ),
		'tooltip'           => __( 'For the best results with both desktop and mobile devices, We recommend using the \'vh\' unit. 1vh is equal to 1% of the height of the screen', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => '20vh',
		'choices'           => array(
			'accept_unitless' => false,
		),
		'active_callback'   => function() {
			if ( 'hide' === get_theme_mod( 'bgtfw_post_header_feat_image_display' ) ) {
				return false;
			}

			$feat_image_pos  = get_theme_mod( 'bgtfw_post_header_feat_image_position' );
			$feat_image_type = get_theme_mod( 'bgtfw_post_header_feat_image_type' );

			return ( 'above-header' === $feat_image_pos || 'below-header' === $feat_image_pos ) && 'background' === $feat_image_type;
		},
		'sanitize_callback' => function( $value, $settings ) {
			$matches = array();
			preg_match( '/[^0-9.]+/', $value, $matches );

			if ( empty( $matches ) ) {
				return $settings->default;
			} else {
				$unit = $matches[0];
			}

			$acceptable_units = array( 'px', 'pt', 'em', 'rem', 'vh', 'vw' );

			if ( ! in_array( $unit, $acceptable_units, true ) ) {
				return $settings->default;
			}

			return $value;
		},
		'output'            => array(
			array(
				'element'  => '.page-header-wrapper .page-header.above .featured-imgage-header.has-feat-image-bg, .page-header-wrapper .page-header.below .featured-imgage-header.has-feat-image-bg',
				'property' => 'height',
			),
		),
	),
	'bgtfw_post_header_feat_image_size'         => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_post_header_feat_image_size',
		'label'             => esc_attr__( 'Size', 'crio' ),
		'tooltip'           => __( 'Change the size of your featured images. Due to container sizes, very large images may now show the full size when left or right aligned', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => 'medium',
		'choices'           => array(
			'thumbnail' => __( 'Thumbnail', 'crio' ),
			'medium'    => __( 'Medium', 'crio' ),
			'large'     => __( 'Large', 'crio' ),
			'full'      => __( 'Full', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'thumbnail', 'medium', 'large', 'full' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => function() {
			if ( 'hide' === get_theme_mod( 'bgtfw_post_header_feat_image_display' ) ) {
				return false;
			}

			$feat_image_pos  = get_theme_mod( 'bgtfw_post_header_feat_image_position' );
			$feat_image_type = get_theme_mod( 'bgtfw_post_header_feat_image_type' );

			if ( 'below' === $feat_image_pos ) {
				return true;
			}

			if ( ( 'above-header' === $feat_image_pos || 'below-header' === $feat_image_pos ) && ( 'image' === $feat_image_type ) ) {
				return true;
			}

			return false;
		},
	),
	'bgtfw_post_header_feat_image_align'        => array(
		'type'              => 'radio-buttonset',
		'transport'         => 'auto',
		'settings'          => 'bgtfw_post_header_feat_image_align',
		'label'             => esc_attr__( 'Alignment', 'crio' ),
		'tooltip'           => __( 'Change the alignment of your image.', 'crio' ),
		'section'           => 'bgtfw_pages_blog_posts_featured_images',
		'default'           => 'alignleft',
		'choices'           => array(
			'alignnone'   => __( 'None', 'crio' ),
			'alignleft'   => __( 'Left', 'crio' ),
			'aligncenter' => __( 'Center', 'crio' ),
			'alignright'  => __( 'Right', 'crio' ),
		),
		'sanitize_callback' => function( $value, $settings ) {
			return in_array( $value, array( 'alignnone', 'alignleft', 'aligncenter', 'alignright' ), true ) ? $value : $settings->default;
		},
		'active_callback'   => function() {
			if ( 'hide' === get_theme_mod( 'bgtfw_post_header_feat_image_display' ) ) {
				return false;
			}

			$feat_image_pos  = get_theme_mod( 'bgtfw_post_header_feat_image_position' );
			$feat_image_type = get_theme_mod( 'bgtfw_post_header_feat_image_type' );

			if ( 'below' === $feat_image_pos ) {
				return true;
			}

			if ( ( 'above-header' === $feat_image_pos || 'below-header' === $feat_image_pos ) && ( 'image' === $feat_image_type ) ) {
				return true;
			}

			return false;
		},
	),
);
