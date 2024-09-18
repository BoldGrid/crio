var BOLDGRID = BOLDGRID || {};
BOLDGRID.CUSTOMIZER = BOLDGRID.CUSTOMIZER || {};

/**
 * Show the user a preview of the widget area
 * @param $
 */
( function( $ ) {
	'use strict';
	var self;
	var onload = function() {
		self.sectionSelector = createSectionsSelector();

		if ( ! wp.customizer ) {
			return;
		}
		self.$previewer = $( wp.customize.previewer.container ).find( 'iframe' ).last().contents();
		bindSectionHover();
		bindForceMouseLeave();

		self.$widgetOverlay = $( '<div id="boldgrid-widget-area-overlay" class="widget-area-overlay hidden"><h2>Widget Area</h2></div>' );
		if ( ! self.$previewer.find( 'body' ).find( '#boldgrid-widget-area-overlay' ).length ) {
			self.$previewer.find( 'body' ).append( self.$widgetOverlay );
		}
		self.$widgetOverlay = self.$previewer.find( 'body' ).find( '#boldgrid-widget-area-overlay' );
	};

	var bindForceMouseLeave = function() {
		if ( true === self.sectionClickBound ) {
			return;
		}
		$( self.sectionSelector ).on( 'click', function() {
			resetOverlay();
			self.$previewer.find( '[data-widget-area][data-empty-area]' ).css( {
				'width': '',
				'height': ''
			} );
		} );

		self.sectionClickBound = true;
	};

	var bindSectionHover = function() {
		var mouseenter = function() {
			var $matchingArea;

			// Ensure 1 mouse enter for 1 mouseleave.
			self.completeEvent = true;
			if ( $( this ).hasClass( 'open' ) ) {
				return;
			}

			$matchingArea = self.$previewer.find( '[data-widget-area="' + this.id + '"]' );
			if ( $matchingArea.is( ':visible' ) && $matchingArea.length ) {
				if ( $matchingArea.attr( 'data-empty-area' ) ) {
					$matchingArea.css( {
						'width': '100%',
						'height': '50px'
					} );

					self.$widgetOverlay.find( 'h2' )
						.prepend( '<span class="empty-phrase-heading">Empty <span>' );
					self.$widgetOverlay.addClass( 'empty-widget-area' );
				}

				highlightWidgetArea( $matchingArea );
			}
		};

		var mouseleave = function() {
			var $matchingArea;
			if ( false === self.completeEvent ) {
				return;
			}

			self.completeEvent = false;
			$matchingArea      = self.$previewer.find( '[data-widget-area="' + this.id + '"]' );
			if ( $matchingArea.is( ':visible' ) && $matchingArea.length ) {
				if ( $matchingArea.attr( 'data-empty-area' ) ) {
					$matchingArea.css( {
						'width': '',
						'height': ''
					} );
				}
				resetOverlay();
			}
		};

		if ( self.sectionSelector && false === self.hoverBound ) {
			self.hoverBound = true;
			$( self.sectionSelector ).hoverIntent( mouseenter, mouseleave );
		}
	};

	var resetOverlay = function() {
		self.$widgetOverlay.find( '.empty-phrase-heading' ).remove();
		self.$widgetOverlay
			.addClass( 'hidden' )
			.removeClass( 'empty-widget-area' );
	};

	var highlightWidgetArea = function( $matchingArea ) {
		var position = $matchingArea[0].getBoundingClientRect(),
			largestHeight = $matchingArea.outerHeight( true ),
			largestWidth = $matchingArea.outerWidth( true ),
			areaOffset;

		$matchingArea.find( '*' ).each( function() {
			var $this = $( this );
			var outerHeight = $this.outerHeight( true );
			var outerWidth = $this.outerWidth( true );
			if ( outerHeight > largestHeight ) {
				largestHeight = outerHeight;
			}
			if ( outerWidth > largestWidth ) {
				largestWidth = outerWidth;
			}
		} );

		self.$widgetOverlay.css( {
			'width': position.width,
			'height': largestHeight,
			'left': $matchingArea.offset().left,
			'top': $matchingArea.offset().top
		} ).removeClass( 'hidden' );

		areaOffset = $matchingArea.offset().top - 65;

		if ( wp.customize( 'bgtfw_fixed_header' )() && 'header-top' === wp.customize( 'bgtfw_header_layout_position' )() ) {
			areaOffset -= self.$previewer.find( '.bgtfw-header-stick' ).outerHeight();
		}

		self.$previewer.find( 'html, body' ).stop().animate( {
			scrollTop: areaOffset
		}, 750 );
	};

	var createSectionsSelector = function() {
		var widgets = wp.customize.panel( 'widgets' ),
			sections,
			sectionSelector = '',
			first = true;

		if ( 'undefined' === typeof widgets ) {
			return;
		}

		sections = wp.customize.panel( 'widgets' ).sections();

		sectionSelector = '';
		first = true;
		$.each( sections, function() {
			if ( false === first ) {
				sectionSelector += ',';
			}

			sectionSelector += '#accordion-section-' + this.id + ':not(.open)';
			first = false;
		} );

		return sectionSelector;
	};
	BOLDGRID.CUSTOMIZER.WidgetPreview = {};
	self = BOLDGRID.CUSTOMIZER.WidgetPreview;
	self.hoverBound = false;
	self.sectionClickBound = false;
	$( function() {
		$( window ).on( 'boldgrid_customizer_refresh', onload );
	} );
} )( jQuery );
