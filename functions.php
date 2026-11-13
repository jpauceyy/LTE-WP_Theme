<?php
/**
 * Learn Try Earn block theme.
 *
 * @package lte
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LTE_VERSION', '1.0.0' );

/**
 * Theme supports.
 */
function lte_setup() {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
}
add_action( 'after_setup_theme', 'lte_setup' );

/**
 * Styles load on the front end AND inside the block editor, so the editor looks like the site.
 */
function lte_block_assets() {
	$uri = get_template_directory_uri();
	$dir = get_template_directory();
	wp_enqueue_style( 'lte-theme', $uri . '/assets/css/theme.css', is_admin() ? array() : array( 'global-styles' ), filemtime( $dir . '/assets/css/theme.css' ) );
	if ( is_admin() ) {
		wp_enqueue_style( 'lte-editor', $uri . '/assets/css/editor.css', array( 'lte-theme' ), filemtime( $dir . '/assets/css/editor.css' ) );
	}
}
add_action( 'enqueue_block_assets', 'lte_block_assets', 20 );

/**
 * Front-end behaviour (reveals, tilt, scroll effects, slider, contact form).
 */
function lte_scripts() {
	$dir = get_template_directory();
	wp_enqueue_script(
		'lte-main',
		get_template_directory_uri() . '/assets/js/lte.js',
		array(),
		filemtime( $dir . '/assets/js/lte.js' ),
		array( 'in_footer' => true, 'strategy' => 'defer' )
	);
}
add_action( 'wp_enqueue_scripts', 'lte_scripts' );

/**
 * Colour hints + favicon fallback, and the splash flag (plays on arrival/refresh, skipped between our own pages).
 */
function lte_head() {
	echo '<meta name="theme-color" content="#040A18">' . "\n";
	echo '<meta name="color-scheme" content="dark">' . "\n";
	if ( ! has_site_icon() ) {
		echo '<link rel="icon" type="image/png" href="' . esc_url( get_template_directory_uri() . '/assets/img/favicon.png' ) . '">' . "\n";
	}
	echo "<script>try{var d=document.documentElement,nav=(performance.getEntriesByType('navigation')[0]||{}).type,internal=document.referrer&&new URL(document.referrer).origin===location.origin;d.classList.add(internal&&nav!=='reload'?'no-splash':'has-splash')}catch(e){}</script>\n";
}
add_action( 'wp_head', 'lte_head', 1 );

/**
 * Front-end only decoration: splash intro, skip link and the glowing background orbs.
 */
function lte_body_open() {
	?>
<div class="splash" id="splash" aria-hidden="true">
<div class="sp-in">
<div class="sp-chart"><i class="up" style="--i:0;--b:6%;--h:16%;--wl:2%;--wh:25%"></i><i class="dn" style="--i:1;--b:13%;--h:9%;--wl:8%;--wh:17%"></i><i class="up" style="--i:2;--b:13%;--h:17%;--wl:10%;--wh:25%"></i><i class="up" style="--i:3;--b:30%;--h:14%;--wl:26%;--wh:23%"></i><i class="dn" style="--i:4;--b:33%;--h:11%;--wl:28%;--wh:19%"></i><i class="up" style="--i:5;--b:33%;--h:19%;--wl:30%;--wh:27%"></i><i class="up" style="--i:6;--b:52%;--h:11%;--wl:47%;--wh:21%"></i><i class="dn" style="--i:7;--b:54%;--h:9%;--wl:50%;--wh:16%"></i><i class="up" style="--i:8;--b:54%;--h:18%;--wl:51%;--wh:26%"></i><i class="up" style="--i:9;--b:72%;--h:12%;--wl:67%;--wh:21%"></i><i class="dn" style="--i:10;--b:75%;--h:9%;--wl:71%;--wh:16%"></i><i class="up" style="--i:11;--b:75%;--h:20%;--wl:73%;--wh:26%"></i></div>
<div class="sp-mark"><i class="m-l"></i><i class="m-a"></i></div>
<div class="sp-bar"><i></i></div>
</div>
</div>
<a class="skip" href="#main"><?php esc_html_e( 'Skip to content', 'lte' ); ?></a>
<div class="glow-fallback" aria-hidden="true"></div>
<div class="orbs" aria-hidden="true"><i></i><i></i></div>
	<?php
}
add_action( 'wp_body_open', 'lte_body_open' );

/**
 * Patterns use root-relative links such as "/about/". Point them at the real site URL
 * (needed when WordPress lives in a sub-folder).
 */
function lte_fix_relative_links( $content ) {
	$home = untrailingslashit( home_url() );
	if ( '' === wp_parse_url( $home, PHP_URL_PATH ) || null === wp_parse_url( $home, PHP_URL_PATH ) ) {
		return $content; // site is at the domain root, nothing to do.
	}
	return preg_replace( '#(href=")/(?!/)#', '$1' . $home . '/', $content );
}
add_filter( 'render_block', 'lte_fix_relative_links' );

/**
 * Pattern category.
 */
function lte_pattern_category() {
	register_block_pattern_category( 'lte', array( 'label' => __( 'Learn Try Earn', 'lte' ) ) );
}
add_action( 'init', 'lte_pattern_category' );

/**
 * On activation: create the four pages from the bundled patterns and make Home the front page.
 * Runs once. Existing pages with the same slug are never overwritten.
 */
function lte_create_pages() {
	if ( get_option( 'lte_pages_created' ) ) {
		return;
	}

	$pages = array(
		'home'        => array( 'Home', 1 ),
		'about'       => array( 'About', 2 ),
		'get-started' => array( 'Get started', 3 ),
		'contact'     => array( 'Contact', 4 ),
	);

	$ids = array();
	foreach ( $pages as $slug => $meta ) {
		$existing = get_page_by_path( $slug );
		if ( $existing ) {
			$ids[ $slug ] = $existing->ID;
			continue;
		}
		$file = get_template_directory() . '/patterns/' . $slug . '.php';
		if ( ! file_exists( $file ) ) {
			continue;
		}
		ob_start();
		include $file;
		$content = trim( ob_get_clean() );

		$id = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $meta[0],
				'post_name'    => $slug,
				'menu_order'   => $meta[1],
				'post_content' => wp_slash( $content ),
			)
		);
		if ( ! is_wp_error( $id ) ) {
			$ids[ $slug ] = $id;
		}
	}

	if ( ! empty( $ids['home'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $ids['home'] );
	}
	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
		update_option( 'lte_flush_rewrite', 1 );
	}
	update_option( 'lte_pages_created', 1 );
}
add_action( 'after_switch_theme', 'lte_create_pages' );

function lte_maybe_flush() {
	if ( get_option( 'lte_flush_rewrite' ) ) {
		delete_option( 'lte_flush_rewrite' );
		flush_rewrite_rules();
	}
}
add_action( 'init', 'lte_maybe_flush', 99 );


/**
 * Admin skin: left menu + login page only (the rest of wp-admin stays default).
 */
function lte_admin_skin() {
	$uri = get_template_directory_uri();
	$dir = get_template_directory();
	wp_enqueue_style( 'lte-admin', $uri . '/assets/css/admin.css', array(), filemtime( $dir . '/assets/css/admin.css' ) );
	wp_add_inline_style( 'lte-admin', ':root{--l-logo-l:url("' . esc_url( $uri . '/assets/img/logo-letters.png' ) . '");--l-logo-a:url("' . esc_url( $uri . '/assets/img/logo-arrow.png' ) . '")}' );
}
add_action( 'admin_enqueue_scripts', 'lte_admin_skin' );
add_action( 'login_enqueue_scripts', 'lte_admin_skin' );

add_filter( 'login_headerurl', function () { return home_url( '/' ); } );
add_filter( 'login_headertext', function () { return get_bloginfo( 'name' ); } );


/* ---------- Custom section blocks (src/blocks -> build/blocks) ---------- */
function lte_kses( $html ) {
	return wp_kses(
		(string) $html,
		array(
			'em'     => array(), 'strong' => array(), 'b' => array(), 'i' => array(), 'br' => array(), 'u' => array(),
			'sup'    => array(), 'sub' => array(), 'code' => array(), 'small' => array(),
			'mark'   => array( 'style' => true, 'class' => true ),
			'span'   => array( 'class' => true, 'style' => true ),
			'a'      => array( 'href' => true, 'target' => true, 'rel' => true ),
		)
	);
}

/** Link URL: "#anchor" becomes home/#anchor when not on the front page. */
function lte_url( $url ) {
	$url = (string) $url;
	if ( '' !== $url && '#' === $url[0] && ! is_front_page() ) {
		$url = home_url( '/' ) . $url;
	}
	return esc_url( $url );
}

function lte_register_blocks() {
	foreach ( glob( get_template_directory() . '/build/blocks/*/block.json' ) as $file ) {
		register_block_type( dirname( $file ) );
	}
}
add_action( 'init', 'lte_register_blocks' );

add_filter( 'block_categories_all', function ( $cats ) {
	array_unshift( $cats, array( 'slug' => 'lte', 'title' => __( 'Learn Try Earn sections', 'lte' ) ) );
	return $cats;
} );

add_action( 'enqueue_block_editor_assets', function () {
	wp_register_script( 'lte-editor-vars', '' );
	wp_enqueue_script( 'lte-editor-vars' );
	wp_add_inline_script( 'lte-editor-vars', 'window.lteTheme=' . wp_json_encode( get_template_directory_uri() ) . ';' );
} );


/** Image field value ({id,url,alt}); 'THEME:/path' points at a file shipped with the theme. */
function lte_img_src( $img ) {
	$url = is_array( $img ) ? (string) ( $img['url'] ?? '' ) : '';
	if ( 0 === strpos( $url, 'THEME:' ) ) {
		return get_template_directory_uri() . substr( $url, 6 );
	}
	return $url;
}
