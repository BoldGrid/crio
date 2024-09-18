jQuery( document ).ready( function( $ ) {
	$( 'body' ).on( 'click', '.wc-tabs li a, ul.tabs li a', function( e ) {
		var $tab,
			$tabsWrapper,
			$tabs;

		e.preventDefault();
		$tab = $( this );
		$tabsWrapper = $tab.closest( '.wc-tabs-wrapper, .woocommerce-tabs' );
		$tabs = $tabsWrapper.find( '.wc-tabs, ul.tabs' );
		$tabs.find( 'li > a' ).removeClass( 'color1-background color-1-text-contrast' );
		$tab.closest( 'li > a' ).addClass( 'color1-background color-1-text-contrast' );
	} );
} );
