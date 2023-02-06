import { Preview as PreviewUtility } from '../preview';

export class Preview  {

	constructor() {
		this.previewUtility = new PreviewUtility();
	}

	/**
	 * Class initialized.
	 *
	 * @since 2.0.0
	 *
	 * @return {Preview} Class instance.
	 */
	init() {
		$( () => this._onLoad() );

		return this;
	}

	/**
	 * Events to run when the Dom loads.
	 *
	 * @since 2.0.0
	 */
	_onLoad() {

		// Set Defaults.
		this._bindGlobalPageTitles();
	}

	/**
	 * Bind the event of the .entry-headers changing colors.
	 *
	 * @since 2.0.0
	 */
	_bindGlobalPageTitles() {
		wp.customize( 'bgtfw_global_title_size', ( value ) => {
			value.bind( newValue => {
				var $pageTitle       = $( '.page-header .entry-title, .page-header .page-title' ),
				classesToRemove  = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

				$( $pageTitle ).removeClass( classesToRemove );
				$( $pageTitle ).addClass( newValue );
			} );
		} );
	}
}

export default Preview;
