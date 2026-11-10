<?php
/**
 * Plugin Name: Giftnest – Vendor data for the Store API
 * Description: Adds vendor name, rating and store URL (Dokan or WCFM Marketplace) to
 *              WooCommerce Store API product responses under extensions.giftnest.vendor,
 *              which the Giftnest storefront renders on each product card.
 * Version:     1.0.0
 * Requires Plugins: woocommerce
 *
 * Install: copy into wp-content/mu-plugins/ (or wp-content/plugins/ and activate).
 * Test:    GET /wp-json/wc/store/v1/products?per_page=1 → extensions.giftnest.vendor
 */

defined( 'ABSPATH' ) || exit;

add_action( 'woocommerce_blocks_loaded', function () {
	if ( ! function_exists( 'woocommerce_store_api_register_endpoint_data' ) ) {
		return;
	}

	woocommerce_store_api_register_endpoint_data( array(
		'endpoint'        => \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER,
		'namespace'       => 'giftnest',
		'data_callback'   => 'giftnest_vendor_for_product',
		'schema_callback' => function () {
			return array(
				'vendor' => array(
					'description' => 'Marketplace vendor selling this product.',
					'type'        => array( 'object', 'null' ),
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
			);
		},
		'schema_type'     => ARRAY_A,
	) );
} );

/**
 * @param WC_Product $product
 * @return array{vendor: array{id:int,name:string,rating:float,url:string}|null}
 */
function giftnest_vendor_for_product( $product ) {
	$product_id = $product->get_id();
	$cache_key  = 'gn_vendor_' . $product_id;
	$cached     = wp_cache_get( $cache_key, 'giftnest' );
	if ( false !== $cached ) {
		return array( 'vendor' => $cached );
	}

	$vendor = null;

	// ── Dokan ───────────────────────────────────────────────
	if ( function_exists( 'dokan_get_vendor_by_product' ) ) {
		$v = dokan_get_vendor_by_product( $product_id );
		if ( $v && $v->get_id() ) {
			$rating = method_exists( $v, 'get_rating' ) ? $v->get_rating() : array();
			$vendor = array(
				'id'     => (int) $v->get_id(),
				'name'   => $v->get_shop_name(),
				'rating' => isset( $rating['rating'] ) ? round( (float) $rating['rating'], 1 ) : 0,
				'url'    => $v->get_shop_url(),
			);
		}
	}

	// ── WCFM Marketplace ────────────────────────────────────
	if ( ! $vendor && function_exists( 'wcfm_get_vendor_id_by_post' ) ) {
		$vendor_id = (int) wcfm_get_vendor_id_by_post( $product_id );
		if ( $vendor_id ) {
			global $WCFMmp;
			$rating = 0;
			if ( $WCFMmp && isset( $WCFMmp->wcfmmp_reviews ) && method_exists( $WCFMmp->wcfmmp_reviews, 'get_vendor_review_rating' ) ) {
				$rating = (float) $WCFMmp->wcfmmp_reviews->get_vendor_review_rating( $vendor_id );
			}
			$vendor = array(
				'id'     => $vendor_id,
				'name'   => function_exists( 'wcfm_get_vendor_store_name' ) ? wp_strip_all_tags( wcfm_get_vendor_store_name( $vendor_id ) ) : get_the_author_meta( 'display_name', $vendor_id ),
				'rating' => round( $rating, 1 ),
				'url'    => function_exists( 'wcfmmp_get_store_url' ) ? wcfmmp_get_store_url( $vendor_id ) : '',
			);
		}
	}

	// ── Fallback: product author (any other multi-vendor plugin) ──
	if ( ! $vendor ) {
		$author = (int) get_post_field( 'post_author', $product_id );
		if ( $author ) {
			$vendor = array(
				'id'     => $author,
				'name'   => get_the_author_meta( 'display_name', $author ),
				'rating' => 0,
				'url'    => get_author_posts_url( $author ),
			);
		}
	}

	wp_cache_set( $cache_key, $vendor, 'giftnest', HOUR_IN_SECONDS );
	return array( 'vendor' => $vendor );
}
