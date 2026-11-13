function build( rootEl ) {
	let n = 0;
	const attrs = {};
	const statics = [];

	function attrStrings( el, skip = [] ) {
		const php = [];
		const jsx = [];
		for ( const [ k0, v ] of Object.entries( el.attributes ) ) {
			const k = k0.toLowerCase();
			if ( skip.includes( k ) ) continue;
			php.push( `${ k0 }="${ v.replace( /"/g, '&quot;' ) }"` );
			if ( k === 'style' ) jsx.push( `style={ ${ JSON.stringify( styleObj( v ) ) } }` );
			else if ( k.startsWith( 'on' ) || k === 'required' || k === 'novalidate' || k === 'autocomplete' ) continue;
			else jsx.push( `${ ATTR_MAP[ k ] || k0 }=${ JSON.stringify( v ) }` );
		}
		return { php: php.length ? ' ' + php.join( ' ' ) : '', jsx: jsx.length ? ' ' + jsx.join( ' ' ) : '' };
	}

	function field( val, type = 'string' ) {
		const key = 'f' + ++n;
		attrs[ key ] = { type, default: val };
		return key;
	}

	function makeStatic( el ) {
		const i = statics.push( el.toString() ) - 1;
		return { php: `<?php echo $static[${ i }]; ?>`, jsx: `<RawHTML>{ STATIC[ ${ i } ] }</RawHTML>` };
	}

	function walk( el, isRoot ) {
		const tag = el.tagName.toLowerCase();
		const cls = ( el.getAttribute( 'class' ) || '' ).split( /\s+/ );

		// decorative / complex pieces stay as markup
		if ( [ 'svg', 'select', 'textarea' ].includes( tag ) ) return makeStatic( el );

		// images shipped with the theme become uploadable image fields
		if ( tag === 'img' && ( el.getAttribute( 'src' ) || '' ).includes( 'THEME_URI' ) ) {
			const key = field( { id: 0, url: 'THEME:' + el.getAttribute( 'src' ).replace( 'THEME_URI', '' ), alt: el.getAttribute( 'alt' ) || '' }, 'object' );
			const a = attrStrings( el, [ 'src', 'alt' ] );
			return {
				php: `<img${ a.php } src="<?php echo esc_url( lte_img_src( $a['${ key }'] ) ); ?>" alt="<?php echo esc_attr( $a['${ key }']['alt'] ?? '' ); ?>">`,
				jsx: `<LteImg${ a.jsx } value={ attributes.${ key } } onChange={ ( v ) => setAttributes( { ${ key }: v } ) } />`,
			};
		}
		if ( tag === 'img' ) {
			const a = attrStrings( el );
			return { php: `<img${ a.php }>`, jsx: `<img${ a.jsx } />` };
		}

		// portrait photo slot: placeholder until a photo is uploaded
		if ( cls.includes( 'portrait' ) ) {
			const key = field( {}, 'object' );
			let php = '';
			let jsx = '';
			for ( const c of el.childNodes.filter( ( x ) => x instanceof HTMLElement ) ) {
				const r = walk( c, false );
				php += r.php;
				jsx += r.jsx;
			}
			const a = attrStrings( el );
			return {
				php: `<${ tag }${ a.php }><?php if ( ! empty( $a['${ key }']['url'] ) ) : ?><img class="portrait-img" src="<?php echo esc_url( $a['${ key }']['url'] ); ?>" alt="<?php echo esc_attr( $a['${ key }']['alt'] ?? '' ); ?>"><?php else : ?>${ php }<?php endif; ?></${ tag }>`,
				jsx: `<${ tag }${ a.jsx }><LtePhoto value={ attributes.${ key } } onChange={ ( v ) => setAttributes( { ${ key }: v } ) }>${ jsx }</LtePhoto></${ tag }>`,
			};
		}

		// links whose content is just text: label + URL both editable
		if ( tag === 'a' && isRichLeaf( el ) ) {
			const label = field( el.innerHTML.trim() );
			const url = field( el.getAttribute( 'href' ) || '' );
			const a = attrStrings( el, [ 'href' ] );
			return {
				php: `<a${ a.php } href="<?php echo lte_url( $a['${ url }'] ); ?>"><?php echo lte_kses( $a['${ label }'] ); ?></a>`,
				jsx: `<LteLink${ a.jsx } label={ attributes.${ label } } url={ attributes.${ url } } onLabel={ ( v ) => setAttributes( { ${ label }: v } ) } onUrl={ ( v ) => setAttributes( { ${ url }: v } ) } />`,
			};
		}

		if ( ! isRoot && tag !== 'a' && isRichLeaf( el ) ) {
			const key = field( el.innerHTML.trim() );
			const a = attrStrings( el );
			const jt = tag === 'form' ? 'div' : tag;
			return {
				php: `<${ tag }${ a.php }><?php echo lte_kses( $a['${ key }'] ); ?></${ tag }>`,
				jsx: `<Rich tag="${ jt }"${ a.jsx } value={ attributes.${ key } } onChange={ ( v ) => setAttributes( { ${ key }: v } ) } />`,
			};
		}

		let php = '';
		let jsx = '';
		for ( const c of el.childNodes ) {
			if ( c instanceof TextNode ) {
				const t = c.text;
				if ( ! t.trim() ) continue;
				php += esc( t.trim() );
				jsx += `{ ${ JSON.stringify( plain( t ) ) } }`;
			} else if ( c instanceof HTMLElement ) {
				const r = walk( c, false );
				php += r.php;
				jsx += r.jsx;
			}
		}

		// links that wrap markup (icon + text, cards): URL is editable, inner text too
		if ( tag === 'a' && el.getAttribute( 'href' ) !== undefined ) {
			const url = field( el.getAttribute( 'href' ) || '' );
			const a = attrStrings( el, [ 'href' ] );
			return {
				php: `<a${ a.php } href="<?php echo lte_url( $a['${ url }'] ); ?>">${ php }</a>`,
				jsx: `<LteUrlLink${ a.jsx } url={ attributes.${ url } } onUrl={ ( v ) => setAttributes( { ${ url }: v } ) }>${ jsx }</LteUrlLink>`,
			};
		}

		const a = attrStrings( el );
		const VOID = [ 'input', 'br', 'hr' ].includes( tag );
		if ( tag === 'input' ) {
			const j = a.jsx.replace( / value=/, ' defaultValue=' );
			return { php: `<input${ a.php }>`, jsx: `<input${ j } readOnly />` };
		}
		if ( VOID ) return { php: `<${ tag }${ a.php }>`, jsx: `<${ tag }${ a.jsx } />` };
		const jt = tag === 'form' ? 'div' : tag;
		return { php: `<${ tag }${ a.php }>${ php }</${ tag }>`, jsx: `<${ jt }${ a.jsx.replace( / action="[^"]*"| method="[^"]*"/g, '' ) }>${ jsx }</${ jt }>` };
	}

	return { walk, attrs, statics };
}

function processPage( page ) {
	const file = path.join( SRC, page + '.php' );
	let html = fs.readFileSync( file, 'utf8' );
	html = html.replace( /^<\?php[\s\S]*?\?>\s*/, '' );
	html = html.split( THEME_TOKEN ).join( 'THEME_URI' );
	html = html.replace( /<!--[\s\S]*?-->/g, '' );
	const dom = parse( html, { comment: false, blockTextElements: {} } );
	const blocks = [];
	for ( const secEl of dom.childNodes.filter( ( x ) => x instanceof HTMLElement ) ) {
		const heading = secEl.querySelector( 'h1' ) || secEl.querySelector( 'h2' );
		const label = heading ? plain( heading.innerHTML ) : ( secEl.getAttribute( 'id' ) || 'section' );
		const idx = blocks.length + 1;
		const nice = NAMES[ page ][ idx - 1 ];
		const name = `${ page }-${ nice }`;
		const { walk, attrs, statics } = build( secEl );
		const r = walk( secEl, true );
		blocks.push( { page, name, title: `${ page === 'get-started' ? 'Get started' : page[ 0 ].toUpperCase() + page.slice( 1 ) }: ${ nice[ 0 ].toUpperCase() + nice.slice( 1 ) } (${ label.length > 30 ? label.slice( 0, 28 ) + '…' : label })`, secEl, attrs, r, statics } );
	}
	return blocks;
}
