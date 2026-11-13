import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group page-hero", id: "top" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap ph-grid"><div className="wp-block-group"><Rich tag="p" className="crumbs" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" className="pill" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="h1" className="wp-block-heading rise" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><Rich tag="p" className="sub rise" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><div className="wp-block-buttons btns rise"><div className="wp-block-button btn-lime"><LteLink className="wp-block-button__link wp-element-button" target="_blank" rel="noopener sponsored" label={ attributes.f5 } url={ attributes.f6 } onLabel={ ( v ) => setAttributes( { f5: v } ) } onUrl={ ( v ) => setAttributes( { f6: v } ) } /></div><div className="wp-block-button btn-line"><LteLink className="wp-block-button__link wp-element-button" label={ attributes.f7 } url={ attributes.f8 } onLabel={ ( v ) => setAttributes( { f7: v } ) } onUrl={ ( v ) => setAttributes( { f8: v } ) } /></div></div></div><div className="wp-block-group rise"><article className="wp-block-group prin glass tilt rise"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /></figure><Rich tag="h3" className="wp-block-heading" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /><Rich tag="p" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /></article></div></div></section>
		);
	},
	save: () => null,
} );
