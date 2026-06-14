<?php
/**
 * Plugin Name: Menubot
 * Plugin URI: https://github.com/cchatterton/menubot
 * Description: Make navigating WordPress admin menus easy for power users.
 * Version: 1.8
 * Requires at least: 6.0
 * Requires PHP: 8.1
 * Author: Techn
 * Author URI: https://techn.com.au
 * License: GPL2
 * Text Domain: menubot
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MENUBOT_VERSION', '1.8');
define('MENUBOT_PLUGIN_FILE', __FILE__);
define('MENUBOT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MENUBOT_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once MENUBOT_PLUGIN_DIR . 'functions/assets.php';
require_once MENUBOT_PLUGIN_DIR . 'functions/github-updater.php';
