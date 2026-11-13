// Generates one editable custom block per page section from the legacy patterns/*.php (core-block markup).
// Every text/link leaf becomes an in-place editable field; markup + classes stay identical to the front end.
// Usage: node tools/gen-blocks.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parse, TextNode, HTMLElement } from 'node-html-parser';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'tools', 'legacy-patterns');
const OUT = path.join(root, 'src', 'blocks');
const PAGES = [ 'home', 'about', 'get-started', 'contact' ];
const NAMES = {
	home: [ 'hero', 'about', 'founder', 'markets', 'risk', 'telegram', 'start', 'reviews', 'cta' ],
	about: [ 'hero', 'story', 'principles', 'focus', 'approach', 'goal', 'caveat', 'cta' ],
	'get-started': [ 'hero', 'account', 'metatrader', 'checklist', 'risk', 'cta' ],
	contact: [ 'hero', 'cta' ],
};

const SIMPLE_INLINE = new Set( [ 'em', 'strong', 'b', 'i', 'br', 'mark', 'sup', 'sub', 'u', 'code', 'small' ] );
const THEME_TOKEN = '<?php echo esc_url( get_template_directory_uri() ); ?>';

const esc = ( s ) => s.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
const slug = ( s ) => s.toLowerCase().replace( /<[^>]+>/g, '' ).replace( /&[a-z#0-9]+;/g, '' ).replace( /[^a-z0-9]+/g, '-' ).replace( /^-|-$/g, '' ).split( '-' ).slice( 0, 4 ).join( '-' );
const plain = ( s ) => s.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/g, ' ' ).replace( /&amp;/g, '&' ).replace( /&#8217;|&rsquo;/g, '’' ).replace( /\s+/g, ' ' ).trim();

function isRichLeaf( el ) {
	let hasText = false;
	const ok = ( n ) => {
		if ( n instanceof TextNode ) { if ( n.text.trim() ) hasText = true; return true; }
		if ( ! ( n instanceof HTMLElement ) ) return true;
		const t = n.tagName.toLowerCase();
		if ( SIMPLE_INLINE.has( t ) ) return n.childNodes.every( ok );
		if ( ( t === 'a' || t === 'span' ) && ! n.getAttribute( 'class' ) && ! n.getAttribute( 'id' ) ) return n.childNodes.every( ok );
		return false;
	};
	return el.childNodes.every( ok ) && hasText;
}

const ATTR_MAP = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', novalidate: 'noValidate', 'stroke-width': 'strokeWidth', viewbox: 'viewBox' };
function styleObj( s ) {
	const o = {};
	s.split( ';' ).forEach( ( d ) => {
		const i = d.indexOf( ':' );
		if ( i < 0 ) return;
		const k = d.slice( 0, i ).trim();
		const v = d.slice( i + 1 ).trim();
		if ( ! k ) return;
		o[ k.startsWith( '--' ) ? k : k.replace( /-([a-z])/g, ( _, c ) => c.toUpperCase() ) ] = v;
	} );
	return o;
}

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
			else if ( [ 'hidden', 'disabled', 'checked', 'multiple', 'selected', 'open' ].includes( k ) ) jsx.push( ATTR_MAP[ k ] || k0 );
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

function emit( b ) {
	const dir = path.join( OUT, b.name );
	fs.mkdirSync( dir, { recursive: true } );
	const secTag = b.secEl.tagName.toLowerCase();
	const cls = b.secEl.getAttribute( 'class' ) || '';
	const id = b.secEl.getAttribute( 'id' ) || '';
	const others = Object.entries( b.secEl.attributes ).filter( ( [ k ] ) => ! [ 'class', 'id' ].includes( k ) );

	const blockJson = {
		$schema: 'https://schemas.wp.org/trunk/block.json',
		apiVersion: 3,
		name: `lte/${ b.name }`,
		title: b.title,
		category: 'lte',
		icon: 'layout',
		supports: { html: false, anchor: true, customClassName: false },
		attributes: b.attrs,
		render: 'file:./render.php',
		editorScript: 'file:./index.js',
	};
	if ( b.name === 'contact-hero' ) blockJson.attributes.formEmail = { type: 'string', default: 'contact@lukefenners.com' };
	fs.writeFileSync( path.join( dir, 'block.json' ), JSON.stringify( blockJson, null, '\t' ) + '\n' );

	// render.php: outer element via wrapper attributes, children from the walk (strip the outer tag)
	const inner = innerOf( b.r.php, secTag );
	const innerJsx = innerOf( b.r.jsx, secTag === 'section' ? 'section' : secTag, true );
	const staticPhp = b.statics.map( ( s, i ) => `$static[${ i }] = <<<'LTEHTML'\n${ s.split( THEME_TOKEN ).join( '' ).replace( /THEME_URI/g, '' ) }\nLTEHTML;\n` ).join( '' );
	const extra = others.map( ( [ k, v ] ) => ` ${ k }="${ v }"` ).join( '' );
	fs.writeFileSync( path.join( dir, 'render.php' ), `<?php
/** ${ b.title } (generated by tools/gen-blocks.mjs, edit freely). */
$a = $attributes;
$static = array();
${ staticPhp }?>
<${ secTag } <?php echo get_block_wrapper_attributes( array( 'class' => '${ cls }'${ id ? `, 'id' => '${ id }'` : '' } ) ); ?>${ extra }>${ inner }</${ secTag }>
` );

	const statics = JSON.stringify( b.statics.map( ( s ) => s.split( THEME_TOKEN ).join( '' ).replace( /THEME_URI/g, '' ) ) );
	fs.writeFileSync( path.join( dir, 'index.js' ), `import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = ${ statics };

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: ${ JSON.stringify( cls ) }${ id ? `, id: ${ JSON.stringify( id ) }` : '' } } );
		return (
			<${ secTag } { ...blockProps }>${ innerJsx }</${ secTag }>
		);
	},
	save: () => null,
} );
` );
}

function innerOf( s, tag, jsx ) {
	const open = s.indexOf( '>' );
	const close = s.lastIndexOf( '</' + tag + '>' );
	return s.slice( open + 1, close );
}

fs.rmSync( OUT, { recursive: true, force: true } );
fs.mkdirSync( path.join( OUT, '_shared' ), { recursive: true } );
fs.copyFileSync( path.join( root, 'tools', 'ui.js' ), path.join( OUT, '_shared', 'ui.js' ) );

const all = [];
for ( const p of PAGES ) all.push( ...processPage( p ) );
const seen = new Set();
for ( const b of all ) {
	while ( seen.has( b.name ) ) b.name += '-2';
	seen.add( b.name );
	emit( b );
}
const manifest = {};
for ( const p of PAGES ) manifest[ p ] = all.filter( ( b ) => b.page === p ).map( ( b ) => `lte/${ b.name }` );
fs.writeFileSync( path.join( root, 'tools', 'manifest.json' ), JSON.stringify( manifest, null, 2 ) );
console.log( all.map( ( b ) => `${ b.name }  (${ Object.keys( b.attrs ).length } fields, ${ b.statics.length } static)` ).join( '\n' ) );

// contact form recipient: sidebar setting instead of a hard-coded address
{
	const d = path.join( OUT, 'contact-hero' );
	let r = fs.readFileSync( path.join( d, 'render.php' ), 'utf8' );
	r = r.replace( 'formsubmit.co/contact@lukefenners.com', "formsubmit.co/<?php echo esc_attr( sanitize_email( $a['formEmail'] ) ); ?>" );
	fs.writeFileSync( path.join( d, 'render.php' ), r );
	let j = fs.readFileSync( path.join( d, 'index.js' ), 'utf8' );
	j = j.replace( "import { useBlockProps } from '@wordpress/block-editor';", "import { useBlockProps, InspectorControls } from '@wordpress/block-editor';\nimport { PanelBody, TextControl } from '@wordpress/components';" );
	j = j.replace( '<section { ...blockProps }>', '<section { ...blockProps }><InspectorControls><PanelBody title="Contact form"><TextControl label="Send form messages to (email)" help="Messages from the contact form are emailed here." value={ attributes.formEmail } onChange={ ( v ) => setAttributes( { formEmail: v } ) } /></PanelBody></InspectorControls>' );
	fs.writeFileSync( path.join( d, 'index.js' ), j );
}
