<?php
/**
 * Admin asset loading for Menubot.
 */

if (!defined('ABSPATH')) {
    exit;
}

function menubot_enqueue_admin_assets() {
    wp_enqueue_style('dashicons');

    wp_enqueue_style(
        'menubot-admin',
        MENUBOT_PLUGIN_URL . 'styles/menubot.css',
        array(),
        MENUBOT_VERSION
    );

    wp_enqueue_script(
        'menubot-admin',
        MENUBOT_PLUGIN_URL . 'scripts/menubot.js',
        array('jquery'),
        MENUBOT_VERSION,
        true
    );
}
add_action('admin_enqueue_scripts', 'menubot_enqueue_admin_assets');
