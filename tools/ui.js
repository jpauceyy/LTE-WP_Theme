import { RichText, MediaUpload, MediaUploadCheck, URLInput } from '@wordpress/block-editor';
import { Button, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SVG, Path } from '@wordpress/primitives';

const mk = ( d ) => (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
		<Path d={ d } />
	</SVG>
);
const chevronUp = mk( 'M6.5 12.4 12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z' );
const chevronDown = mk( 'M17.5 11.6 12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z' );
const trash = mk( 'M20 5h-5.7c0-1.3-1-2.3-2.3-2.3S9.7 3.7 9.7 5H4v2h1.5l.5 12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2l.5-12H20V5zm-8-.3c.5 0 .8.3.8.8h-1.6c0-.5.3-.8.8-.8zM16.5 19l-.1.4H7.6l-.1-.4L7 7h10l-.5 12zM10 9v8h1.5V9H10zm2.5 0v8H14V9h-1.5z' );
const plus = mk( 'M11 12.5V17.5h1.5V12.5H17.5V11H12.5V6H11v5H6v1.5h5z' );
const upload = mk( 'M18 15v3H6v-3H4.5v3c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5v-3H18zM7.9 8.6l.9 1.1 2.5-2.1v7.9h1.4V7.6l2.5 2.1.9-1.1L12 5.5 7.9 8.6z' );
const link = mk( 'M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z' );

export const setIn = ( a, i, p ) => a.map( ( x, k ) => ( k === i ? { ...x, ...p } : x ) );
export const removeAt = ( a, i ) => a.filter( ( _, k ) => k !== i );
export const moveBy = ( a, i, d ) => {
	const j = i + d;
	if ( j < 0 || j >= a.length ) return a;
	const c = [ ...a ];
	[ c[ i ], c[ j ] ] = [ c[ j ], c[ i ] ];
	return c;
};

/** Inline editable text. `plain` disables formatting. */
export function Rich( { tag = 'span', value, onChange, className, placeholder, plain, ...rest } ) {
	return (
		<RichText
			tagName={ tag }
			value={ value }
			onChange={ onChange }
			className={ className }
			placeholder={ placeholder || __( 'Type…', 'lte' ) }
			allowedFormats={ plain ? [] : [ 'core/bold', 'core/italic', 'core/link' ] }
			{ ...rest }
		/>
	);
}

/** Move up / down / delete controls for one repeater item (shown when the block is selected). */
export function Ctl( { arr, i, set } ) {
	return (
		<span className="lte-ctl">
			<Button size="small" icon={ chevronUp } label={ __( 'Move up', 'lte' ) } title={ __( 'Move up', 'lte' ) } onClick={ () => set( moveBy( arr, i, -1 ) ) } />
			<Button size="small" icon={ chevronDown } label={ __( 'Move down', 'lte' ) } title={ __( 'Move down', 'lte' ) } onClick={ () => set( moveBy( arr, i, 1 ) ) } />
			<Button size="small" icon={ trash } isDestructive label={ __( 'Delete this item', 'lte' ) } title={ __( 'Delete this item', 'lte' ) } onClick={ () => set( removeAt( arr, i ) ) } />
		</span>
	);
}

export function Add( { onClick, label } ) {
	return (
		<Button className="lte-add" variant="secondary" icon={ plus } onClick={ onClick }>
			{ label }
		</Button>
	);
}

/** Link label edited in place; the link icon opens a URL popover. */
export function LinkField( { label, url, onLabel, onUrl, linkClass, placeholder } ) {
	const [ open, setOpen ] = useState( false );
	return (
		<span className="lte-lf">
			<a className={ linkClass } href={ url || '#' } onClick={ ( e ) => e.preventDefault() }>
				<Rich value={ label } onChange={ onLabel } plain placeholder={ placeholder || __( 'Button text', 'lte' ) } />
			</a>
			<Button className="lte-linkbtn" icon={ link } label={ __( 'Edit link', 'lte' ) } title={ __( 'Edit link', 'lte' ) } onClick={ () => setOpen( ! open ) } />
			{ open && (
				<Popover onClose={ () => setOpen( false ) } focusOnMount="firstElement">
					<div style={ { padding: 8, width: 320 } }>
						<URLInput value={ url } onChange={ onUrl } />
					</div>
				</Popover>
			) }
		</span>
	);
}

/** Click-to-upload image slot. value = { id, url, alt }. `label` names what to upload; children = fallback caption. */
export function Img( { value, onChange, className, children, label } ) {
	const v = value || {};
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ v.id }
				onSelect={ ( m ) => onChange( { id: m.id, url: m.url, alt: m.alt || '' } ) }
				render={ ( { open } ) => (
					<div className={ ( className || '' ) + ' lte-imgslot lte-host' + ( v.url ? ' has-image' : '' ) } onClick={ open } role="button" tabIndex={ 0 } title={ v.url ? __( 'Click to replace this image', 'lte' ) : __( 'Click to upload an image', 'lte' ) } onKeyDown={ ( e ) => ( e.key === 'Enter' ? open() : null ) }>
						{ v.url ? (
							<>
								<img src={ v.url } alt={ v.alt || '' } />
								<span className="lte-replace">{ upload } { __( 'Click to replace image', 'lte' ) }</span>
							</>
						) : (
							<div className="lte-upload">
								<span className="lte-upload-btn">{ upload } { label || __( 'Upload image', 'lte' ) }</span>
								<small>{ __( 'Click here to choose an image from the Media Library or your computer.', 'lte' ) }</small>
								{ children && (
									<div className="lte-upload-caption" onClick={ ( e ) => e.stopPropagation() }>
										<small>{ __( 'Placeholder text shown until an image is uploaded:', 'lte' ) }</small>
										{ children }
									</div>
								) }
							</div>
						) }
						{ v.url && (
							<span className="lte-ctl">
								<Button size="small" icon={ trash } isDestructive label={ __( 'Remove image', 'lte' ) } title={ __( 'Remove image', 'lte' ) } onClick={ ( e ) => { e.stopPropagation(); onChange( {} ); } } />
							</span>
						) }
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}

/** Link edited in place: label is rich text, the link icon opens a URL popover. Extra props go on the <a>. */
export function LteLink( { label, url, onLabel, onUrl, ...rest } ) {
	const [ open, setOpen ] = useState( false );
	return (
		<span className="lte-lf">
			<a { ...rest } href={ url || '#' } onClick={ ( e ) => e.preventDefault() }>
				<Rich value={ label } onChange={ onLabel } placeholder={ __( 'Button text', 'lte' ) } />
			</a>
			<Button className="lte-linkbtn" icon={ link } label={ __( 'Edit link', 'lte' ) } title={ __( 'Edit link', 'lte' ) } onClick={ () => setOpen( ! open ) } />
			{ open && (
				<Popover onClose={ () => setOpen( false ) } focusOnMount="firstElement">
					<div style={ { padding: 8, width: 320 } }>
						<URLInput value={ url } onChange={ onUrl } />
					</div>
				</Popover>
			) }
		</span>
	);
}

const themeUrl = ( u ) => ( u && u.startsWith( 'THEME:' ) ? ( window.lteTheme || '' ) + u.slice( 6 ) : u );

/** Link that wraps other markup (icon + text): the URL is edited through the small link button. */
export function LteUrlLink( { url, onUrl, children, ...rest } ) {
	const [ open, setOpen ] = useState( false );
	return (
		<span className="lte-lf lte-lf-wrap">
			<a { ...rest } href={ url || '#' } onClick={ ( e ) => e.preventDefault() }>{ children }</a>
			<Button className="lte-linkbtn" icon={ link } label={ __( 'Edit link', 'lte' ) } title={ __( 'Edit link', 'lte' ) } onClick={ () => setOpen( ! open ) } />
			{ open && (
				<Popover onClose={ () => setOpen( false ) } focusOnMount="firstElement">
					<div style={ { padding: 8, width: 320 } }>
						<URLInput value={ url } onChange={ onUrl } />
					</div>
				</Popover>
			) }
		</span>
	);
}

/** Theme icon/image that can be replaced from the Media Library. value = { id, url, alt }. */
export function LteImg( { value, onChange, ...rest } ) {
	const v = value || {};
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ v.id }
				onSelect={ ( m ) => onChange( { id: m.id, url: m.url, alt: m.alt || v.alt || '' } ) }
				render={ ( { open } ) => (
					<span className="lte-imgedit">
						<img { ...rest } src={ themeUrl( v.url ) } alt={ v.alt || '' } onClick={ open } title={ __( 'Click to replace this image', 'lte' ) } />
						<Button className="lte-imgbtn" icon={ upload } label={ __( 'Replace image', 'lte' ) } title={ __( 'Replace image', 'lte' ) } onClick={ open } />
					</span>
				) }
			/>
		</MediaUploadCheck>
	);
}

/** Photo slot with a placeholder (children) shown until an image is uploaded. */
export function LtePhoto( { value, onChange, children } ) {
	const v = value || {};
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ v.id }
				onSelect={ ( m ) => onChange( { id: m.id, url: m.url, alt: m.alt || '' } ) }
				render={ ( { open } ) => (
					<>
						{ v.url ? <img className="portrait-img" src={ v.url } alt={ v.alt || '' } /> : children }
						<span className="lte-photo-ctl">
							<Button variant="primary" icon={ upload } onClick={ open }>{ v.url ? __( 'Replace photo', 'lte' ) : __( 'Upload photo', 'lte' ) }</Button>
							{ v.url && <Button isDestructive variant="secondary" icon={ trash } onClick={ () => onChange( {} ) }>{ __( 'Remove', 'lte' ) }</Button> }
						</span>
					</>
				) }
			/>
		</MediaUploadCheck>
	);
}
