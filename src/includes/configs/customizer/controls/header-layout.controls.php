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
	'bgtfw_video_background_all'    => array(
		'type'        => 'switch',
		'settings'    => 'bgtfw_video_background_all',
		'transport'   => 'refresh',
		'label'       => '',
		'description' => esc_attr__( 'By default, the header video will only display on the home page. If you want the video to display on all pages, disable this option.', 'crio' ),
		'section'     => 'header_image',
		'default'     => true,
		'priority'    => 11,
		'choices'     => array(
			'on'  => esc_attr__( 'Home Only', 'crio' ),
			'off' => esc_attr__( 'All Pages', 'crio' ),
		),
	),
	'bgtfw_header_layout_col_width' => array(
		'settings'          => 'bgtfw_header_layout_col_width',
		'transport'         => 'refresh',
		'label'             => __( 'Header Column Widths', 'crio' ),
		'priority'          => 8,
		'section'           => 'bgtfw_header_layout',
		'type'              => 'kirki-generic',
		'default'           => $bgtfw_generic->get_column_defaults(),
		'sanitize_callback' => array( 'Boldgrid_Framework_Customizer_Generic', 'sanitize' ),
		'choices'           => array(
			'name'     => 'boldgrid_controls',
			'type'     => 'ColWidth',
			'settings' => array(
				'responsive' => Boldgrid_Framework_Customizer_Generic::$device_sizes,
				'control'    => array(
					'selectors'   => array( '.site-header header row' ),
					'sliders'     => $bgtfw_generic->get_header_columns(),
					'description' => __(
						'Headers have a maximum of 12 columns per row. If the total columns used by the items in a row exceed 12, they will be rolled over to a new row.',
						'crio'
					),
				),
				'slider'     => array(
					'col' => array(
						'min'   => 1,
						'max'   => 12,
						'step'  => 1,
						'value' => 6,
					),
				),
			),
		),
	),
	'bgtfw_header_layout_position'  => array(
		'settings'          => 'bgtfw_header_layout_position',
		'transport'         => 'postMessage',
		'label'             => __( 'Header Position', 'crio' ),
		'type'              => 'radio-buttonset',
		'priority'          => 5,
		'default'           => 'header-top',
		'choices'           => array(
			'header-left'  => '<span class="icon-advanced-layout-left"></span>' . esc_html__( 'Left', 'crio' ),
			'header-top'   => '<span class="icon-advanced-layout-top"></span>' . esc_html__( 'Top', 'crio' ),
			'header-right' => '<span class="icon-advanced-layout-right"></span>' . esc_html__( 'Right', 'crio' ),
		),
		'section'           => 'bgtfw_header_layout_advanced',
		'sanitize_callback' => 'sanitize_html_class',
	),
	'bgtfw_header_layout'           => array(
		'settings'  => 'bgtfw_header_layout',
		'label'     => '<div class="screen-reader-text">' . __( 'Standard Header Layout', 'crio' ) . '</div>',
		'type'      => 'bgtfw-sortable-accordion',
		'default'   => array(
			array(
				'container' => 'container',
				'items'     => array(
					array(
						'type'    => 'boldgrid_site_identity',
						'key'     => 'branding',
						'align'   => 'w',
						'uid'     => 'h47',
						'display' => array(
							array(
								'selector' => '.custom-logo-link',
								'display'  => 'show',
								'title'    => __( 'Logo', 'crio' ),
							),
							array(
								'selector' => '.site-title',
								'display'  => 'show',
								'title'    => __( 'Title', 'crio' ),
							),
							array(
								'selector' => '.site-description',
								'display'  => 'show',
								'title'    => __( 'Tagline', 'crio' ),
							),
						),
					),
					array(
						'type'  => 'boldgrid_menu_main',
						'key'   => 'menu',
						'align' => 'e',
						'uid'   => 'h48',
					),
				),
			),
		),
		'items'     => array(
			'menu'     => array(
				'icon'     => 'dashicons dashicons-menu',
				'title'    => __( 'Menu', 'crio' ),
				'controls' => array(
					'menu-select' => array(),
					'align'       => array(
						'default' => 'nw',
					),
				),
			),
			'branding' => array(
				'icon'     => 'dashicons dashicons-store',
				'title'    => __( 'Branding', 'crio' ),
				'controls' => array(
					'display' => array(
						'default' => array(
							array(
								'selector' => '.custom-logo-link',
								'display'  => 'show',
								'title'    => __( 'Logo', 'crio' ),
							),
							array(
								'selector' => '.site-title',
								'display'  => 'show',
								'title'    => __( 'Title', 'crio' ),
							),
							array(
								'selector' => '.site-description',
								'display'  => 'show',
								'title'    => __( 'Tagline', 'crio' ),
							),
						),
					),
					'align'   => array(
						'default' => 'nw',
					),
				),
			),
			'sidebar'  => array(
				'icon'     => 'dashicons dashicons-layout',
				'title'    => __( 'Widget Area', 'crio' ),
				'controls' => array(
					'sidebar-edit' => array(),
				),
			),
		),
		'location'  => 'header',
		'section'   => 'bgtfw_header_layout',
		'transport' => 'postMessage',
	),
	'bgtfw_header_layout_custom'    => array(
		'settings'  => 'bgtfw_header_layout_custom',
		'transport' => 'postMessage',
		'label'     => '<div class="screen-reader-text">' . __( 'Custom Header Layout', 'crio' ) . '</div>',
		'type'      => 'bgtfw-sortable-accordion',
		'default'   => $bgtfw_presets->get_custom_layout( 'header' ),
		'items'     => array(
			'menu'     => array(
				'icon'     => 'dashicons dashicons-menu',
				'title'    => __( 'Menu', 'crio' ),
				'controls' => array(
					'menu-select' => array(),
					'align'       => array(
						'default' => 'nw',
					),
				),
			),
			'branding' => array(
				'icon'     => 'dashicons dashicons-store',
				'title'    => __( 'Branding', 'crio' ),
				'controls' => array(
					'display' => array(
						'default' => array(
							array(
								'selector' => '.custom-logo-link',
								'display'  => 'show',
								'title'    => __( 'Logo', 'crio' ),
							),
							array(
								'selector' => '.site-title',
								'display'  => 'show',
								'title'    => __( 'Title', 'crio' ),
							),
							array(
								'selector' => '.site-description',
								'display'  => 'show',
								'title'    => __( 'Tagline', 'crio' ),
							),
						),
					),
					'align'   => array(
						'default' => 'nw',
					),
				),
			),
			'sidebar'  => array(
				'icon'     => 'dashicons dashicons-layout',
				'title'    => __( 'Widget Area', 'crio' ),
				'controls' => array(
					'sidebar-edit' => array(),
				),
			),
		),
		'location'  => 'header',
		'section'   => 'bgtfw_header_layout_advanced',
	),
	'bgtfw_header_preset_branding'  => array(
		'type'            => 'multicheck',
		'settings'        => 'bgtfw_header_preset_branding',
		'description'     => $bgtfw_presets->get_branding_notices(),
		'transport'       => 'postMessage',
		'label'           => esc_html__( 'Branding Display', 'crio' ),
		'section'         => 'bgtfw_header_presets',
		'default'         => array( 'logo' ),
		'priority'        => 1,
		'choices'         => array(
			'logo'        => esc_html__( 'Logo', 'crio' ),
			'title'       => esc_html__( 'Site Title', 'crio' ),
			'description' => esc_html__( 'Tagline', 'crio' ),
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_header_preset',
				'operator' => '!=',
				'value'    => 'default',
			),
			array(
				'setting'  => 'bgtfw_header_preset',
				'operator' => '!=',
				'value'    => 'custom',
			),
		),
	),
	'bgtfw_header_preset'           => array(
		'type'      => 'radio-image',
		'transport' => 'postMessage',
		'settings'  => 'bgtfw_header_preset',
		'label'     => esc_html__( 'Header Layout', 'crio' ),
		'section'   => 'bgtfw_header_presets',
		'default'   => 'default',
		'priority'  => 2,
		'choices'   => $bgtfw_presets->get_preset_choices( 'header' ),
		'edit_vars' => array(
			array(
				'selector'    => '#masthead.header',
				'label'       => esc_html__( 'Header Layout', 'crio' ),
				'description' => esc_html__( 'Change the header layout preset', 'crio' ),
			),
		),
	),
	'bgtfw_header_width'            => array(
		'type'            => 'slider',
		'settings'        => 'bgtfw_header_width',
		'transport'       => 'auto',
		'label'           => esc_attr__( 'Header Width', 'crio' ),
		'section'         => 'bgtfw_header_layout_advanced',
		'default'         => 400,
		'choices'         => array(
			'min'  => '0',
			'max'  => '600',
			'step' => '1',
		),
		'active_callback' => array(
			array(
				'setting'  => 'bgtfw_header_layout_position',
				'operator' => '!=',
				'value'    => 'header-top',
			),
		),
		'output'          => array(
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.flexbox .header-left .site-header, .flexbox .header-right .site-header',
				'property'      => 'flex',
				'value_pattern' => '0 0 $px',
			),
			array(
				'media_query'   => '@media only screen and (max-width : 968px)',
				'element'       => '.flexbox .header-left .site-content, .flexbox .header-right .site-content',
				'property'      => 'flex',
				'value_pattern' => '1 0 calc(100% - $px)',
			),
			array(
				'media_query'   => '@media only screen and (min-width: 992px)',
				'element'       => '.flexbox .header-left.has-sidebar .main, .flexbox .header-right.has-sidebar .main',
				'property'      => 'width',
				'value_pattern' => 'calc((100% * (2/3)) - $px + 1em)',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => ' .flexbox .header-left.header-fixed .site-footer, .flexbox .header-right.header-fixed .site-footer',
				'property'      => 'width',
				'value_pattern' => 'calc(100% - $px)',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.flexbox .header-left .site-content, .flexbox .header-left.header-fixed .site-footer, .flexbox .header-right .site-content, .flexbox .header-right.header-fixed .site-footer',
				'property'      => 'width',
				'value_pattern' => 'calc(100% - $px)',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.flexbox .header-right.header-fixed .site-header, .flexbox .header-left.header-fixed .site-header, .header-right .wp-custom-header, .header-left .wp-custom-header, .header-right .site-header, .header-left .site-header, .header-left #masthead, .header-right #masthead',
				'property'      => 'width',
				'value_pattern' => '$px',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.header-left #navi-wrap, .header-right #navi-wrap',
				'property'      => 'max-width',
				'value_pattern' => '$px',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.flexbox .header-right.header-fixed .site-footer, .flexbox .header-right.header-fixed .site-content',
				'property'      => 'margin-right',
				'value_pattern' => '$px',
			),
			array(
				'media_query'   => '@media only screen and (min-width : 768px)',
				'element'       => '.flexbox .header-left.header-fixed .site-footer, .flexbox .header-left.header-fixed .site-content',
				'property'      => 'margin-left',
				'value_pattern' => '$px',
			),
		),
		'edit_vars'       => array(
			array(
				'selector'    => array( '.flexbox .header-left .site-header .boldgrid-section.custom-preset', '.flexbox .header-right .site-header .boldgrid-section.custom-preset' ),
				'label'       => __( 'Header Width', 'crio' ),
				'description' => __( 'Adjust the width of your header', 'crio' ),
			),
		),
	),
	'bgtfw_header_color'            => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_header_color',
		'label'             => esc_attr__( 'Background Color', 'crio' ),
		'section'           => 'header_image',
		'priority'          => 1,
		'default'           => '',
		'choices'           => array(
			'colors' => $bgtfw_formatted_palette,
			'size'   => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
		'edit_vars'         => array(
			array(
				'selector'    => '#masthead.header',
				'label'       => esc_html__( 'Header Background', 'crio' ),
				'description' => esc_html__( 'Change the header background color or set a background image / video', 'crio' ),
			),
		),
	),
	'bgtfw_header_overlay'          => array(
		'type'        => 'switch',
		'settings'    => 'bgtfw_header_overlay',
		'transport'   => 'postMessage',
		'label'       => __( 'Header Overlay', 'crio' ),
		'description' => esc_attr__( 'Add an overlay to give your text readability over an image or video.', 'crio' ),
		'section'     => 'header_image',
		'default'     => false,
		'priority'    => 20,
		'choices'     => array(
			'on'  => esc_attr__( 'Enable', 'crio' ),
			'off' => esc_attr__( 'Disable', 'crio' ),
		),
	),
	'bgtfw_header_overlay_color'    => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_header_overlay_color',
		'label'             => esc_attr__( 'Overlay Color', 'crio' ),
		'section'           => 'header_image',
		'priority'          => 25,
		'default'           => 'color-1',
		'choices'           => array(
			'colors' => $bgtfw_formatted_palette,
			'size'   => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
	),
	'bgtfw_header_overlay_alpha'    => array(
		'type'      => 'slider',
		'transport' => 'postMessage',
		'settings'  => 'bgtfw_header_overlay_alpha',
		'label'     => esc_attr__( 'Overlay Opacity', 'crio' ),
		'section'   => 'header_image',
		'priority'  => 30,
		'default'   => '0.70',
		'choices'   => array(
			'min'  => '0',
			'max'  => '1',
			'step' => '.01',
		),
	),
);
