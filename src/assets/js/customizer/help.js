/**
 * File: help.js
 * 
 * This is used to display the help / tutorial
 * videos inside the customizer.
 * 
 * @package Crio
 * @since 2.22.0
 */
var BOLDGRID = BOLDGRID || {};
BOLDGRID.CUSTOMIZER = BOLDGRID.CUSTOMIZER || {};
BOLDGRID.CUSTOMIZER.Help = BOLDGRID.CUSTOMIZER.Help || {};

'use strict';

/**
 * Customizer Help JS
 *
 * @since  2.22.0
 * @package Crio
 */

( function( $ ) {

	/**
	 * Handles logic for the customizer help interface.
	 *
	 * @class BOLDGRID.CUSTOMIZER.Help
	 * @since 2.22.0
	 */
	BOLDGRID.CUSTOMIZER.Help = {
		/**
		 * Initializes the customizer help interface.
		 *
		 * @since 2.22.0
		 */
		_init: function _init() {
			this._bind();

			$( document ).on( 'click', '.customize-help-modal-toggle', function() {
				BOLDGRID.CUSTOMIZER.Help._toggleHelpModal();
			} );

			$( document ).on( 'click', '#customizer-help-modal .close-icon', function() {
				BOLDGRID.CUSTOMIZER.Help._closeHelpModal();
			} );

			$( document ).on( 'click', '#customizer-help-modal .onb-videos-list .button', function() {
				BOLDGRID.CUSTOMIZER.Help._updateVideoEmbed( $( this ) );
			} );
		},

		/**
		 * Bind Video List Buttons
		 * 
		 * @since 2.22.0
		 * 
		 * @param {object} $button jQuery Object.
		 */
		_updateVideoEmbed: function _updateVideoEmbed( $button ) {
			var videoId = $button.data( 'video-id' );
			$( '#customizer-help-modal .onb-active-video iFrame' )
				.attr(
					'src',
					`https://www.youtube.com/embed/${videoId}`
				);
		},

		
		/**
		 * Binds admin customize events.
		 *
		 * @since 2.22.0
		 */
		_bind: function _bind() {
			wp.customize.previewer.targetWindow.bind(
				$.proxy( this._renderTemplate, this )
			);
		},

		/**
		 * Adds the templates to the customizer.
		 *
		 * @since 2.22.0
		 */
		_renderTemplate: function _renderTemplate() {
			var template;

			template = wp.template( 'help-button' );
			if ( $( '#customize-header-actions .customize-help-modal-toggle' ).length === 0 ) {
				$( '#customize-header-actions' ).append( template() );
			}

			template = wp.template( 'help-modal' );
			if ( $( '#customizer-help-modal' ).length === 0 ) {
				$( '#customize-header-actions' ).after( template() );
			}

			if ( CrioCustomizerHelp.autoDisplayVideos ) {
				BOLDGRID.CUSTOMIZER.Help._openHelpModal();
			}
		},

		/**
		 * Toggles the help modal.
		 *
		 * @since  2.22.0
		 */
		_toggleHelpModal: function _toggleHelpModal() {
			if ( $( '#customizer-help-modal' ).hasClass( 'open' ) ) {
				BOLDGRID.CUSTOMIZER.Help._closeHelpModal();
			} else {
				BOLDGRID.CUSTOMIZER.Help._openHelpModal();
			}
		},

		/**
		 * Closes the help Modal.
		 *
		 * @since 2.22.0
		 */
		_closeHelpModal: function _closeHelpModal() {
			$( '#customizer-help-modal' ).removeClass( 'open' ).slideUp( 'fast' );
			$( '#customize-header-actions .customize-help-modal-toggle' ).removeClass( 'open' );

			if ( CrioCustomizerHelp.autoDisplayVideos ) {
				BOLDGRID.CUSTOMIZER.Help._loadAdminPointer();
				BOLDGRID.CUSTOMIZER.Help._ajaxDismiss(
					$( '#customizer-help-modal .close-icon' ).data( 'nonce' )
				);
				CrioCustomizerHelp.autoDisplayVideos = false;
			}
		},

		/**
		 * Opens the help modal.
		 *
		 * @since  2.22.0
		 */
		_openHelpModal: function _openHelpModal() {
			$( '#customizer-help-modal' ).css( {
				top: $( '#customize-header-actions' ).outerHeight() + 'px',
				height: 450 + 'px',
				width: 950 + 'px',
				left: $( '#customize-controls' ).outerWidth() + 20 + 'px'
			} );

			$( '#customize-header-actions .customize-help-modal-toggle' ).addClass( 'open' );
			$( '#customizer-help-modal' ).addClass( 'open' ).slideDown( 'fast' );
		},

		/**
		 * Dismiss the notice via ajax.
		 * 
		 * @since 2.22.0
		 * 
		 * @param {string} nonce Nonce.
		 */
		_ajaxDismiss: function _ajaxDismiss( nonce ) {
			$.post( ajaxurl, {
				nonce: nonce,
				action: 'boldgrid_framework_customizer_dismiss_help',
			} );
		},

		/**
		 * Load the admin pointer.
		 * 
		 * @since 2.22.0
		 */
		_loadAdminPointer: function _loadAdminPointer() {
			var $target  = $( '#customize-header-actions .customize-help-modal-toggle' ),
				template = wp.template( 'help-modal-pointer' );
				options  = {
					pointerClass: 'wp-pointer crio-onb-videos',
					content: template(),
					position: {
						edge: 'left',
						align: 'top',
					},
					close: function() {
						$.post( ajaxurl, {
							pointer: 'crio-onb-videos',
							action: 'dismiss-wp-pointer'
						} );
						$target.pointer( 'destroy' );
					}
				};

			$target.pointer( options ).pointer( 'open' );
			$target.pointer( 'reposition' );
		}
	};

	// Initialize.
	$( function() {
		BOLDGRID.CUSTOMIZER.Help._init();
	} );

} )( jQuery );
