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
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group head rise"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /></div><div className="wp-block-group revs"><article className="wp-block-group rev glass rise"><Rich tag="p" className="tagp" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><blockquote className="wp-block-quote"><Rich tag="p" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /></blockquote><div className="wp-block-group who"><Rich tag="p" className="nm" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" className="since" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></div></article><article className="wp-block-group rev glass rise"><Rich tag="p" className="tagp" value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /><blockquote className="wp-block-quote"><Rich tag="p" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /></blockquote><div className="wp-block-group who"><Rich tag="p" className="nm" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /><Rich tag="p" className="since" value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /></div></article><article className="wp-block-group rev glass rise"><Rich tag="p" className="tagp" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /><blockquote className="wp-block-quote"><Rich tag="p" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /></blockquote><div className="wp-block-group who"><Rich tag="p" className="nm" value={ attributes.f12 } onChange={ ( v ) => setAttributes( { f12: v } ) } /><Rich tag="p" className="since" value={ attributes.f13 } onChange={ ( v ) => setAttributes( { f13: v } ) } /></div></article></div><Rich tag="p" className="rev-note" value={ attributes.f14 } onChange={ ( v ) => setAttributes( { f14: v } ) } /></div></section>
		);
	},
	save: () => null,
} );
