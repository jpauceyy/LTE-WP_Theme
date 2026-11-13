import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, Fragment } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto, Ctl, Add, setIn, LteRepeaterPanel } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0" } );
		return (
			<section { ...blockProps }><InspectorControls><LteRepeaterPanel title="p (list)" items={ attributes.r1 } set={ ( v ) => setAttributes( { r1: v } ) } /></InspectorControls><div className="wp-block-group wrap"><div className="wp-block-group reality glass rise"><div className="wp-block-group shield"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /></figure></div><div className="wp-block-group"><Rich tag="h2" className="wp-block-heading" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } />{ attributes.r1.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { r1: setIn( attributes.r1, i, p ) } ); return <Fragment key={ i }><Rich tag="p" value={ item.k1 } onChange={ ( v ) => setItem( { k1: v } ) } /></Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { r1: [ ...attributes.r1, JSON.parse( JSON.stringify( attributes.r1[ attributes.r1.length - 1 ] || {} ) ) ] } ) } /></div></div></div></div></section>
		);
	},
	save: () => null,
} );
