import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group head rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /></div><div className="wp-block-group prin-grid"><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></article><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /><Rich tag="p" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /></article><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /><Rich tag="p" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /></article></div></div></section>
		);
	},
	save: () => null,
} );
