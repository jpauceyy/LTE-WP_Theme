import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, Fragment } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto, Ctl, Add, setIn, LteRepeaterPanel } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0", id: "metatrader" } );
		return (
			<section { ...blockProps }><InspectorControls><LteRepeaterPanel title="step3 (list)" items={ attributes.r1 } set={ ( v ) => setAttributes( { r1: v } ) } /><LteRepeaterPanel title="prin (list)" items={ attributes.r2 } set={ ( v ) => setAttributes( { r2: v } ) } /></InspectorControls><div className="wp-block-group wrap"><div className="wp-block-group head rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /></div><div className="wp-block-group steps3">{ attributes.r1.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { r1: setIn( attributes.r1, i, p ) } ); return <Fragment key={ i }><article data-lte-item="" className="wp-block-group step3 glass tilt rise"><Rich tag="p" className="n" value={ item.k1 } onChange={ ( v ) => setItem( { k1: v } ) } /><Rich tag="h3" className="wp-block-heading" value={ item.k2 } onChange={ ( v ) => setItem( { k2: v } ) } /><Rich tag="p" value={ item.k3 } onChange={ ( v ) => setItem( { k3: v } ) } /><Ctl arr={ attributes.r1 } i={ i } set={ ( v ) => setAttributes( { r1: v } ) } /></article></Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { r1: [ ...attributes.r1, JSON.parse( JSON.stringify( attributes.r1[ attributes.r1.length - 1 ] || {} ) ) ] } ) } /></div></div><div className="wp-block-group prin-grid mt-28">{ attributes.r2.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { r2: setIn( attributes.r2, i, p ) } ); return <Fragment key={ i }><article data-lte-item="" className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ item.k1 } onChange={ ( v ) => setItem( { k1: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ item.k2 } onChange={ ( v ) => setItem( { k2: v } ) } /><Rich tag="p" value={ item.k3 } onChange={ ( v ) => setItem( { k3: v } ) } /><Ctl arr={ attributes.r2 } i={ i } set={ ( v ) => setAttributes( { r2: v } ) } /></article></Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { r2: [ ...attributes.r2, JSON.parse( JSON.stringify( attributes.r2[ attributes.r2.length - 1 ] || {} ) ) ] } ) } /></div></div></div></section>
		);
	},
	save: () => null,
} );
