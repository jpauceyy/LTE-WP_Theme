import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0", id: "founder" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap founder"><div className="wp-block-group rise"><div className="wp-block-group portrait-wrap"><div className="wp-block-group portrait"><LtePhoto value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) }><Rich tag="p" className="ph" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" className="ph-note mono" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /></LtePhoto></div><div className="wp-block-group float-chip a"><Rich tag="p" className="t" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" className="s" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></div><div className="wp-block-group float-chip b"><Rich tag="p" className="t" value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /><Rich tag="p" className="s" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /></div></div></div><div className="wp-block-group founder-copy"><div className="wp-block-group head wide rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /></div><Rich tag="p" className="rise" value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /><blockquote className="wp-block-quote quote rise"><Rich tag="p" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /></blockquote><div className="wp-block-group stat-row"><div className="wp-block-group stat rise"><Rich tag="p" className="t" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /><Rich tag="p" className="s" value={ attributes.f12 } onChange={ ( v ) => setAttributes( { f12: v } ) } /></div><div className="wp-block-group stat rise"><Rich tag="p" className="t" value={ attributes.f13 } onChange={ ( v ) => setAttributes( { f13: v } ) } /><Rich tag="p" className="s" value={ attributes.f14 } onChange={ ( v ) => setAttributes( { f14: v } ) } /></div><div className="wp-block-group stat rise"><Rich tag="p" className="t" value={ attributes.f15 } onChange={ ( v ) => setAttributes( { f15: v } ) } /><Rich tag="p" className="s" value={ attributes.f16 } onChange={ ( v ) => setAttributes( { f16: v } ) } /></div></div><div className="wp-block-buttons btns rise"><div className="wp-block-button btn-lime"><LteLink className="wp-block-button__link wp-element-button" label={ attributes.f17 } url={ attributes.f18 } onLabel={ ( v ) => setAttributes( { f17: v } ) } onUrl={ ( v ) => setAttributes( { f18: v } ) } /></div></div></div></div></section>
		);
	},
	save: () => null,
} );
