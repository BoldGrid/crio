<?php
/**
 * Base Template.
 *
 * This file contains the base structure of a BoldGrid Theme.
 *
 * @since 2.0
 * @package Crio
 */

$template = SI_Templating_API::override_template( 'invoice' );
load_template( $template );
