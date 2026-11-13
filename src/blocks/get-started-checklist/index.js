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
			<section { ...blockProps }><InspectorControls><LteRepeaterPanel title="rise (list)" items={ attributes.r1 } set={ ( v ) => setAttributes( { r1: v } ) } /></InspectorControls><div className="wp-block-group wrap"><div className="wp-block-group lime-panel"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" className="big" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" className="lede-w" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><div className="wp-block-group lime-cols four">{ attributes.r1.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { r1: setIn( attributes.r1, i, p ) } ); return <Fragment key={ i }><div data-lte-item="" className="wp-block-group rise"><Rich tag="h3" className="wp-block-heading" value={ item.k1 } onChange={ ( v ) => setItem( { k1: v } ) } /><Rich tag="p" value={ item.k2 } onChange={ ( v ) => setItem( { k2: v } ) } /><Ctl arr={ attributes.r1 } i={ i } set={ ( v ) => setAttributes( { r1: v } ) } /></div></Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { r1: [ ...attributes.r1, JSON.parse( JSON.stringify( attributes.r1[ attributes.r1.length - 1 ] || {} ) ) ] } ) } /></div></div></div></div></section>
		);
	},
	save: () => null,
} );
