import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group sec pt-0", id: "goal" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group lime-panel"><Rich tag="h2" className="wp-block-heading" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="p" className="big" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" className="lede-w" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><div className="wp-block-group lime-cols four"><div className="wp-block-group rise"><Rich tag="h3" className="wp-block-heading" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /><Rich tag="p" value={ attributes.f5 } onChange={ ( v ) => setAttributes( { f5: v } ) } /></div><div className="wp-block-group rise"><Rich tag="h3" className="wp-block-heading" value={ attributes.f6 } onChange={ ( v ) => setAttributes( { f6: v } ) } /><Rich tag="p" value={ attributes.f7 } onChange={ ( v ) => setAttributes( { f7: v } ) } /></div><div className="wp-block-group rise"><Rich tag="h3" className="wp-block-heading" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /><Rich tag="p" value={ attributes.f9 } onChange={ ( v ) => setAttributes( { f9: v } ) } /></div><div className="wp-block-group rise"><Rich tag="h3" className="wp-block-heading" value={ attributes.f10 } onChange={ ( v ) => setAttributes( { f10: v } ) } /><Rich tag="p" value={ attributes.f11 } onChange={ ( v ) => setAttributes( { f11: v } ) } /></div></div></div></div></section>
		);
	},
	save: () => null,
} );
