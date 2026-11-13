import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, Fragment } from '@wordpress/element';
import { Rich, LteLink, LteUrlLink, LteImg, LtePhoto, Ctl, Add, setIn, LteRepeaterPanel } from '../_shared/ui';
import metadata from './block.json';

const STATIC = [];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps( { className: "wp-block-group finale" } );
		return (
			<section { ...blockProps }><div className="wp-block-group wrap"><div className="wp-block-group final-card glass"><div className="wp-block-group lte-mark m-final"><div className="wp-block-group m-l"></div><div className="wp-block-group m-a"></div></div><Rich tag="p" className="pill rise" value={ attributes.f1 } onChange={ ( v ) => setAttributes( { f1: v } ) } /><Rich tag="h2" className="wp-block-heading rise" value={ attributes.f2 } onChange={ ( v ) => setAttributes( { f2: v } ) } /><Rich tag="p" className="rise" value={ attributes.f3 } onChange={ ( v ) => setAttributes( { f3: v } ) } /><div className="wp-block-buttons btns rise"><div className="wp-block-button btn-lime ico-telegram"><LteLink className="wp-block-button__link wp-element-button" target="_blank" rel="noopener" label={ attributes.f4 } url={ attributes.f5 } onLabel={ ( v ) => setAttributes( { f4: v } ) } onUrl={ ( v ) => setAttributes( { f5: v } ) } /></div><div className="wp-block-button btn-line ico-play"><LteLink className="wp-block-button__link wp-element-button" target="_blank" rel="noopener" label={ attributes.f6 } url={ attributes.f7 } onLabel={ ( v ) => setAttributes( { f6: v } ) } onUrl={ ( v ) => setAttributes( { f7: v } ) } /></div></div><Rich tag="p" className="mono final-note rise" value={ attributes.f8 } onChange={ ( v ) => setAttributes( { f8: v } ) } /></div></div></section>
		);
	},
	save: () => null,
} );
