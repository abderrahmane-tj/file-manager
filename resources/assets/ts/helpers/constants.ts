export const BASE_URL = window['__LARAVEL_VARS'].base_url;
export const CSRF_TOKEN = window['__LARAVEL_VARS'].csrf_token;

let baseString = BASE_URL.replace(window.location.origin,"");
export const BASE_FOLDER = baseString.substr(0,baseString.length-1);
