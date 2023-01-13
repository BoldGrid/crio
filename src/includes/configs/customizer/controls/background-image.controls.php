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
	'boldgrid_background_type'       => array(
		'type'      => 'radio-buttonset',
		'transport' => 'postMessage',
		'settings'  => 'boldgrid_background_type',
		'section'   => 'background_image',
		'default'   => 'image',
		'priority'  => 0,
		'choices'   => array(
			'image'   => '<span class="dashicons dashicons-format-image"></span>' . esc_html__( 'Image', 'crio' ),
			'pattern' => '<span class="dashicons dashicons-art"></span>' . esc_html__( 'Pattern & Color', 'crio' ),
		),
		'edit_vars' => array(
			array(
				'selector'    => array( '.page .site-content', '.post .site-content', '.blog .site-content' ),
				'label'       => __( 'Body Background', 'crio' ),
				'description' => __( 'Change the background of your site', 'crio' ),
			),
		),
	),
	'boldgrid_background_image_size' => array(
		'type'      => 'radio',
		'label'     => __( 'Background Image Size', 'crio' ),
		'section'   => 'background_image',
		'settings'  => 'boldgrid_background_image_size',
		'transport' => 'refresh',
		'default'   => 'cover',
		'priority'  => 15,
		'choices'   => array(
			'cover'     => __( 'Cover Page', 'crio' ),
			'contain'   => __( 'Scaled to Fit', 'crio' ),
			'100% auto' => __( 'Full Width', 'crio' ),
			'auto 100%' => __( 'Full Height', 'crio' ),
			'inherit'   => __( 'Default', 'crio' ),
			'auto'      => __( 'Do Not Resize', 'crio' ),
		),
	),
	'boldgrid_background_color'      => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'boldgrid_background_color',
		'label'             => esc_attr__( 'Color', 'crio' ),
		'description'       => esc_attr__( 'Choose a color from your palette to use.', 'crio' ),
		'tooltip'           => 'testing what a tool tip looks like',
		'section'           => 'background_image',
		'priority'          => 2,
		'default'           => 'color-neutral',
		'choices'           => array(
			'colors' => $bgtfw_formatted_palette,
			'size'   => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
	),
	'bgtfw_background_overlay'       => array(
		'type'        => 'switch',
		'settings'    => 'bgtfw_background_overlay',
		'transport'   => 'postMessage',
		'label'       => __( 'Image Overlay', 'crio' ),
		'description' => esc_attr__( 'Add an overlay to give your text readability over an image.', 'crio' ),
		'section'     => 'background_image',
		'default'     => false,
		'priority'    => 10,
		'choices'     => array(
			'on'  => esc_attr__( 'Enable', 'crio' ),
			'off' => esc_attr__( 'Disable', 'crio' ),
		),
	),
	'bgtfw_background_overlay_color' => array(
		'type'              => 'bgtfw-palette-selector',
		'transport'         => 'postMessage',
		'settings'          => 'bgtfw_background_overlay_color',
		'label'             => esc_attr__( 'Overlay Color', 'crio' ),
		'section'           => 'background_image',
		'priority'          => 10,
		'default'           => 'color-1',
		'choices'           => array(
			'colors' => $bgtfw_formatted_palette,
			'size'   => $bgtfw_palette->get_palette_size( $bgtfw_formatted_palette ),
		),
		'sanitize_callback' => array( $bgtfw_color_sanitize, 'sanitize_palette_selector' ),
	),
	'bgtfw_background_overlay_type'  => array(
		'type'      => 'select',
		'transport' => 'postMessage',
		'settings'  => 'bgtfw_background_overlay_type',
		'label'     => esc_attr__( 'Overlay Blend Mode', 'crio' ),
		'section'   => 'background_image',
		'priority'  => 10,
		'default'   => 'overlay',
		'choices'   => array(
			'multiply'    => __( 'Multiply', 'crio' ),
			'screen'      => __( 'Screen', 'crio' ),
			'overlay'     => __( 'Overlay', 'crio' ),
			'darken'      => __( 'Darken', 'crio' ),
			'lighten'     => __( 'Lighten', 'crio' ),
			'color-dodge' => __( 'Color Dodge', 'crio' ),
			'color-burn'  => __( 'Color Burn', 'crio' ),
			'hard-light'  => __( 'Hard Light', 'crio' ),
			'soft-light'  => __( 'Soft Light', 'crio' ),
			'difference'  => __( 'Difference', 'crio' ),
			'exclusion'   => __( 'Exclusion', 'crio' ),
			'hue'         => __( 'Hue', 'crio' ),
			'saturation'  => __( 'Saturation', 'crio' ),
			'color'       => __( 'Color', 'crio' ),
			'luminosity'  => __( 'Luminosity', 'crio' ),
		),
	),
	'bgtfw_background_overlay_alpha' => array(
		'type'      => 'slider',
		'transport' => 'postMessage',
		'settings'  => 'bgtfw_background_overlay_alpha',
		'label'     => esc_attr__( 'Overlay Opacity', 'crio' ),
		'section'   => 'background_image',
		'priority'  => 10,
		'default'   => '0.70',
		'choices'   => array(
			'min'  => '0',
			'max'  => '1',
			'step' => '.01',
		),
	),
);
