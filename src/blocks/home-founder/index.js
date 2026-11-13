import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, Fragment } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto, Ctl, Add, setIn, LteRepeaterPanel } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0", id: "founder" } );
		return (
			<section { ...blockProps }><InspectorControls><LteRepeaterPanel title="stat (list)" items={ attributes.r1 } set={ ( v ) => setAttributes( { r1: v } ) } /></InspectorControls><div className="wp-block-group wrap founder"><div className="wp-block-group rise"><div className="wp-block-group portrait-wrap"><div className="wp-block-group portrait"><LtePhoto value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) }><Rich tag="p" className="ph" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" className="ph-note mono" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /></LtePhoto></div><div className="wp-block-group float-chip a"><Rich tag="p" className="t" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" className="s" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></div><div className="wp-block-group float-chip b"><Rich tag="p" className="t" value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /><Rich tag="p" className="s" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /></div></div></div><div className="wp-block-group founder-copy"><div className="wp-block-group head wide rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /></div><Rich tag="p" className="rise" value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /><blockquote className="wp-block-quote quote rise"><Rich tag="p" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /></blockquote><div className="wp-block-group stat-row">{ attributes.r1.map( ( item, i ) => { const setItem = ( p ) => setAttributes( { r1: setIn( attributes.r1, i, p ) } ); return <Fragment key={ i }><div data-lte-item="" className="wp-block-group stat rise"><Rich tag="p" className="t" value={ item.k1 } onChange={ ( v ) => setItem( { k1: v } ) } /><Rich tag="p" className="s" value={ item.k2 } onChange={ ( v ) => setItem( { k2: v } ) } /><Ctl arr={ attributes.r1 } i={ i } set={ ( v ) => setAttributes( { r1: v } ) } /></div></Fragment>; } ) }<div className="lte-addrow"><Add label="Add item" onClick={ () => setAttributes( { r1: [ ...attributes.r1, JSON.parse( JSON.stringify( attributes.r1[ attributes.r1.length - 1 ] || {} ) ) ] } ) } /></div></div><div className="wp-block-buttons btns rise"><div className="wp-block-button btn-lime"><LteLink className="wp-block-button__link wp-element-button" label={ attributes.f11 } url={ attributes.f12 } onLabel={ ( v ) => setAttributes( { f11: v } ) } onUrl={ ( v ) => setAttributes( { f12: v } ) } /></div></div></div></div></section>
		);
	},
	save: () => null,
} );
