import fs from 'node:fs';

const g = 'tools/gen-blocks.mjs';
const L = fs.readFileSync( g, 'utf8' ).split( '\n' );
const start = L.findIndex( ( l ) => l.startsWith( 'function build(' ) );
const end = L.findIndex( ( l, i ) => i > start && l.startsWith( 'function emit(' ) );
const part = fs.readFileSync( 'tools/patch-gen.part.mjs', 'utf8' );
let s = [ ...L.slice( 0, start ), part, ...L.slice( end ) ].join( '\n' );

const NL = String.fromCharCode( 92 ) + 'n'; // a literal backslash + n for generated source

// generic template imports
s = s.replace(
	"import { useBlockProps } from '@wordpress/block-editor';\nimport { RawHTML } from '@wordpress/element';",
	"import { useBlockProps, InspectorControls } from '@wordpress/block-editor';\nimport { RawHTML, Fragment } from '@wordpress/element';"
);
s = s.replace(
	"import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';",
	"import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto, Ctl, Add, setIn, LteRepeaterPanel } from '../_shared/ui';"
);

// summary line
s = s.replace(
	"${ Object.keys( b.attrs ).length } fields, ${ b.statics.length } static)` ).join(",
	"${ Object.keys( b.attrs ).length } fields, ${ b.statics.length } static) repeaters: ${ b.repeaters.map( ( r ) => r.label + 'x' + r.count ).join( ', ' ) || '-' }` ).join("
);

// sidebar list panels for every repeater of the block
s = s.replace(
	'<${ secTag } { ...blockProps }>${ innerJsx }</${ secTag }>',
	'<${ secTag } { ...blockProps }>${ b.repeaters.length ? `<InspectorControls>${ b.repeaters.map( ( r ) => `<LteRepeaterPanel title="${ r.label } (list)" items={ attributes.${ r.key } } set={ ( v ) => setAttributes( { ${ r.key }: v } ) } />` ).join( \'\' ) }</InspectorControls>` : \'\' }${ innerJsx }</${ secTag }>'
);

// contact special-case: only the components import is needed now
s = s.split( '\n' ).map( ( l ) => {
	if ( l.startsWith( '\tj = j.replace( "import { useBlockProps }' ) ) {
		return '\tj = j.replace( "import { RawHTML", "import { PanelBody, TextControl } from \'@wordpress/components\';' + NL + 'import { RawHTML" );';
	}
	return l;
} ).join( '\n' );

fs.writeFileSync( g, s );
console.log( 'spliced', start, end );
