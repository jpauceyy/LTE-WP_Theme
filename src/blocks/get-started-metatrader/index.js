import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0", id: "metatrader" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group head rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /></div><div className="wp-block-group steps3"><article className="wp-block-group step3 glass tilt rise"><Rich tag="p" className="n" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><Rich tag="h3" className="wp-block-heading" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></article><article className="wp-block-group step3 glass tilt rise"><Rich tag="p" className="n" value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /><Rich tag="h3" className="wp-block-heading" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /><Rich tag="p" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /></article><article className="wp-block-group step3 glass tilt rise"><Rich tag="p" className="n" value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /><Rich tag="h3" className="wp-block-heading" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /><Rich tag="p" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /></article></div><div className="wp-block-group prin-grid mt-28"><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f12 } onChange={ ( v ) => setAttributes( { f12: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f13 } onChange={ ( v ) => setAttributes( { f13: v } ) } /><Rich tag="p" value={ attributes.f14 } onChange={ ( v ) => setAttributes( { f14: v } ) } /></article><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f15 } onChange={ ( v ) => setAttributes( { f15: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f16 } onChange={ ( v ) => setAttributes( { f16: v } ) } /><Rich tag="p" value={ attributes.f17 } onChange={ ( v ) => setAttributes( { f17: v } ) } /></article><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f18 } onChange={ ( v ) => setAttributes( { f18: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f19 } onChange={ ( v ) => setAttributes( { f19: v } ) } /><Rich tag="p" value={ attributes.f20 } onChange={ ( v ) => setAttributes( { f20: v } ) } /></article></div></div></section>
		);
	},
	save: () => null,
} );
