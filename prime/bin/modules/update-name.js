const fs = require( 'fs' ),
	glob = require( 'glob' ),
	fsp = require( 'fs' ).promises;

module.exports = ( to, name, config ) => {
	return new Promise( ( resolve, reject ) => {
		const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

		if ( to.includes( 'readme.txt' ) || to.includes( 'style.css' ) || to.includes( 'rtl.css' ) ) {
			fs.readFile( to, 'utf8', function( err, content ) {
				if ( err ) {
					return console.log( err );
				}

				let result = content.replace( /prime/g, name.toLowerCase() );
				result = result.replace( /Prime/g, ucFirst( name ) );

				if ( result !== content ) {
					fs.writeFile( to, result, 'utf8', function( err ) {
						if ( err ) {
							reject( err );
						}
						resolve();
					} );
				}

				//console.info( `Updated theme name from Prime to ${ ucFirst( name ) } in ${to}` );
			} );
		} else {
			const files = glob.sync( to, config.globOpts );
			let promises = files.map( file => {
				try {
					( async () => {
						let content = await fsp.readFile( file, 'utf8' );
						let result = content.replace( /(\s\*+\s@package\s)([p|P]rime)/, `$1${ ucFirst( name ) }` );
						if ( result !== content ) {
							console.log( file );
							await fsp.writeFile( file, result, 'utf8' );
						}
					} )();

				} catch ( err ) {
					console.error( err );
				}
			} );

			return Promise.all( promises ).then( files => {
				resolve( files );
			} ).catch( err => {
				reject( err );
			} );
		}
	} );
};
