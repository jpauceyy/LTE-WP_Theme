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
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group reality glass rise"><div className="wp-block-group shield"><figure className="wp-block-image size-full ico"><LteImg value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /></figure></div><div className="wp-block-group"><Rich tag="h2" className="wp-block-heading" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><Rich tag="p" value={ attributes.f4 } onChange={ ( v ) => setAttributes( { f4: v } ) } /></div></div></div></section>
		);
	},
	save: () => null,
} );
