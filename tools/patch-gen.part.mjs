const BOOL_ATTRS = [ 'hidden', 'disabled', 'checked', 'multiple', 'selected', 'open' ];
const sigOf = ( el ) => el.tagName.toLowerCase() + '|' + ( el.getAttribute( 'class' ) || '' );

/** Index of the '>' that closes the first opening tag (ignores '>' inside quotes / braces). */
function openTagEnd( s ) {
	let q = null;
	let depth = 0;
	for ( let i = 0; i < s.length; i++ ) {
		const c = s[ i ];
		if ( q ) { if ( c === q && s[ i - 1 ] !== '\\' ) q = null; continue; }
		if ( c === '"' || c === "'" ) { q = c; continue; }
		if ( c === '{' ) depth++;
		if ( c === '}' ) depth--;
		if ( c === '>' && depth === 0 ) return i;
	}
	return -1;
}

function build( rootEl ) {
	const attrs = {};
	const statics = [];
	const repeaters = [];
	let rn = 0;
	let blockN = 0;

	const blockCtx = {
		item: false,
		field( val, type = 'string' ) {
			const key = 'f' + ++blockN;
			attrs[ key ] = { type, default: val };
			return key;
		},
		php: ( k ) => `$a['${ k }']`,
		get: ( k ) => `attributes.${ k }`,
		set: ( k, v = 'v' ) => `setAttributes( { ${ k }: ${ v } } )`,
	};

	function newItemCtx() {
		let n = 0;
		const values = {};
		return {
			item: true,
			values,
			field( val ) {
				const key = 'k' + ++n;
				values[ key ] = val;
				return key;
			},
			php: ( k ) => `$it['${ k }']`,
			get: ( k ) => `item.${ k }`,
			set: ( k, v = 'v' ) => `setItem( { ${ k }: ${ v } } )`,
		};
	}

	function attrStrings( el, skip = [] ) {
		const php = [];
		const jsx = [];
		for ( const [ k0, v ] of Object.entries( el.attributes ) ) {
			const k = k0.toLowerCase();
			if ( skip.includes( k ) ) continue;
			php.push( `${ k0 }="${ v.replace( /"/g, '&quot;' ) }"` );
			if ( k === 'style' ) jsx.push( `style={ ${ JSON.stringify( styleObj( v ) ) } }` );
			else if ( k.startsWith( 'on' ) || k === 'required' || k === 'novalidate' || k === 'autocomplete' ) continue;
			else if ( BOOL_ATTRS.includes( k ) ) jsx.push( ATTR_MAP[ k ] || k0 );
			else jsx.push( `${ ATTR_MAP[ k ] || k0 }=${ JSON.stringify( v ) }` );
		}
		return { php: php.length ? ' ' + php.join( ' ' ) : '', jsx: jsx.length ? ' ' + jsx.join( ' ' ) : '' };
	}

	function makeStatic( el ) {
		const i = statics.push( el.toString() ) - 1;
		return { php: `<?php echo $static[${ i }]; ?>`, jsx: `<RawHTML>{ STATIC[ ${ i } ] }</RawHTML>` };
	}

	function walk( el, isRoot, ctx ) {
		const tag = el.tagName.toLowerCase();
		const cls = ( el.getAttribute( 'class' ) || '' ).split( /\s+/ );

		if ( [ 'svg', 'select', 'textarea' ].includes( tag ) ) return makeStatic( el );

		if ( tag === 'img' && ( el.getAttribute( 'src' ) || '' ).includes( 'THEME_URI' ) ) {
			const key = ctx.field( { id: 0, url: 'THEME:' + el.getAttribute( 'src' ).replace( 'THEME_URI', '' ), alt: el.getAttribute( 'alt' ) || '' }, 'object' );
			const a = attrStrings( el, [ 'src', 'alt' ] );
			return {
				php: `<img${ a.php } src="<?php echo esc_url( lte_img_src( ${ ctx.php( key ) } ) ); ?>" alt="<?php echo esc_attr( ${ ctx.php( key ) }['alt'] ?? '' ); ?>">`,
				jsx: `<LteImg${ a.jsx } value={ ${ ctx.get( key ) } } onChange={ ( v ) => ${ ctx.set( key ) } } />`,
			};
		}
		if ( tag === 'img' ) {
			const a = attrStrings( el );
			return { php: `<img${ a.php }>`, jsx: `<img${ a.jsx } />` };
		}

		if ( cls.includes( 'portrait' ) && ! ctx.item ) {
			const key = ctx.field( {}, 'object' );
			let php = '';
			let jsx = '';
			for ( const c of el.childNodes.filter( ( x ) => x instanceof HTMLElement ) ) {
				const r = walk( c, false, ctx );
				php += r.php;
				jsx += r.jsx;
			}
			const a = attrStrings( el );
			return {
				php: `<${ tag }${ a.php }><?php if ( ! empty( ${ ctx.php( key ) }['url'] ) ) : ?><img class="portrait-img" src="<?php echo esc_url( ${ ctx.php( key ) }['url'] ); ?>" alt="<?php echo esc_attr( ${ ctx.php( key ) }['alt'] ?? '' ); ?>"><?php else : ?>${ php }<?php endif; ?></${ tag }>`,
				jsx: `<${ tag }${ a.jsx }><LtePhoto value={ ${ ctx.get( key ) } } onChange={ ( v ) => ${ ctx.set( key ) } }>${ jsx }</LtePhoto></${ tag }>`,
			};
		}

		if ( tag === 'a' && isRichLeaf( el ) ) {
			const label = ctx.field( el.innerHTML.trim() );
			const url = ctx.field( el.getAttribute( 'href' ) || '' );
			const a = attrStrings( el, [ 'href' ] );
			return {
				php: `<a${ a.php } href="<?php echo lte_url( ${ ctx.php( url ) } ); ?>"><?php echo lte_kses( ${ ctx.php( label ) } ); ?></a>`,
				jsx: `<LteLink${ a.jsx } label={ ${ ctx.get( label ) } } url={ ${ ctx.get( url ) } } onLabel={ ( v ) => ${ ctx.set( label ) } } onUrl={ ( v ) => ${ ctx.set( url ) } } />`,
			};
		}

		if ( ! isRoot && tag !== 'a' && isRichLeaf( el ) ) {
			const key = ctx.field( el.innerHTML.trim() );
			const a = attrStrings( el );
			const jt = tag === 'form' ? 'div' : tag;
			return {
				php: `<${ tag }${ a.php }><?php echo lte_kses( ${ ctx.php( key ) } ); ?></${ tag }>`,
				jsx: `<Rich tag="${ jt }"${ a.jsx } value={ ${ ctx.get( key ) } } onChange={ ( v ) => ${ ctx.set( key ) } } />`,
			};
		}

		let php = '';
		let jsx = '';
		const kids = el.childNodes.filter( ( c ) => c instanceof HTMLElement || ( c instanceof TextNode && c.text.trim() ) );
		for ( let i = 0; i < kids.length; i++ ) {
			const c = kids[ i ];
			if ( c instanceof TextNode ) {
				php += esc( c.text.trim() );
				jsx += `{ ${ JSON.stringify( plain( c.text ) ) } }`;
				continue;
			}
			// run of identically structured siblings -> repeater
			if ( ! ctx.item && tag !== 'form' && ! [ 'svg', 'select', 'a' ].includes( tag ) ) {
				let j = i;
				while ( j + 1 < kids.length && kids[ j + 1 ] instanceof HTMLElement && sigOf( kids[ j + 1 ] ) === sigOf( c ) ) j++;
				if ( j > i ) {
					const rep = tryRepeater( kids.slice( i, j + 1 ) );
					if ( rep ) {
						php += rep.php;
						jsx += rep.jsx;
						i = j;
						continue;
					}
				}
			}
			const r = walk( c, false, ctx );
			php += r.php;
			jsx += r.jsx;
		}

		if ( tag === 'a' && el.getAttribute( 'href' ) !== undefined ) {
			const url = ctx.field( el.getAttribute( 'href' ) || '' );
			const a = attrStrings( el, [ 'href' ] );
			return {
				php: `<a${ a.php } href="<?php echo lte_url( ${ ctx.php( url ) } ); ?>">${ php }</a>`,
				jsx: `<LteUrlLink${ a.jsx } url={ ${ ctx.get( url ) } } onUrl={ ( v ) => ${ ctx.set( url ) } }>${ jsx }</LteUrlLink>`,
			};
		}

		const a = attrStrings( el );
		if ( tag === 'input' ) {
			const j = a.jsx.replace( / value=/, ' defaultValue=' );
			return { php: `<input${ a.php }>`, jsx: `<input${ j } readOnly />` };
		}
		if ( [ 'br', 'hr' ].includes( tag ) ) return { php: `<${ tag }${ a.php }>`, jsx: `<${ tag }${ a.jsx } />` };
		const jt = tag === 'form' ? 'div' : tag;
		return { php: `<${ tag }${ a.php }>${ php }</${ tag }>`, jsx: `<${ jt }${ a.jsx.replace( / action="[^"]*"| method="[^"]*"/g, '' ) }>${ jsx }</${ jt }>` };
	}

	function tryRepeater( items ) {
		if ( items.some( ( it ) => it.querySelector( 'input,select,textarea,form' ) ) ) return null;
		const mark = statics.length;
		const walked = items.map( ( it ) => {
			const ctx = newItemCtx();
			const r = walk( it, false, ctx );
			return { r, ctx };
		} );
		const first = walked[ 0 ];
		const ok = Object.keys( first.ctx.values ).length > 0 && walked.every( ( w ) => w.r.php === first.r.php && w.r.jsx === first.r.jsx );
		if ( ! ok ) {
			statics.length = mark;
			return null;
		}
		const key = 'r' + ++rn;
		attrs[ key ] = { type: 'array', default: walked.map( ( w ) => w.ctx.values ) };
		repeaters.push( { key, label: sigOf( items[ 0 ] ).split( '|' )[ 1 ].split( /\s+/ ).filter( ( c ) => c && c !== 'wp-block-group' )[ 0 ] || items[ 0 ].tagName.toLowerCase(), count: items.length } );

		let ij = first.r.jsx;
		const m = ij.match( /^<([a-z0-9]+)\b/ );
		if ( m && ! [ 'input', 'br', 'hr', 'img' ].includes( m[ 1 ] ) ) {
			const end = openTagEnd( ij );
			const close = ij.lastIndexOf( `</${ m[ 1 ] }>` );
			if ( end > 0 && close > end && ij[ end - 1 ] !== '/' ) {
				const ctl = `<Ctl arr={ attributes.${ key } } i={ i } set={ ( v ) => setAttributes( { ${ key }: v } ) } />`;
				ij = `<${ m[ 1 ] } data-lte-item=""` + ij.slice( m[ 1 ].length + 1, close ) + ctl + ij.slice( close );
			}
		}
		return {
			php: `<?php foreach ( $a['${ key }'] as $it ) : ?>${ first.r.php }<?php endforeach; ?>`,
			jsx: `{ attributes.${ key }.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { ${ key }: setIn( attributes.${ key }, i, p ) } ); return <Fragment key={ i }>${ ij }</Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { ${ key }: [ ...attributes.${ key }, JSON.parse( JSON.stringify( attributes.${ key }[ attributes.${ key }.length - 1 ] || {} ) ) ] } ) } /></div>`,
		};
	}

	return { walk: ( el, isRoot ) => walk( el, isRoot, blockCtx ), attrs, statics, repeaters };
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
		const { walk, attrs, statics, repeaters } = build( secEl );
		const r = walk( secEl, true );
		blocks.push( { page, name, title: `${ page === 'get-started' ? 'Get started' : page[ 0 ].toUpperCase() + page.slice( 1 ) }: ${ nice[ 0 ].toUpperCase() + nice.slice( 1 ) } (${ label.length > 30 ? label.slice( 0, 28 ) + '…' : label })`, secEl, attrs, r, statics, repeaters } );
	}
	return blocks;
}

