<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::post('/upload/{id?}','FilesController@upload');

Route::get('/{path}', function () {
  $csrf_token = csrf_token();
  $base_url = url('/').'/';
  return view('home',
    ['__LARAVEL_VARS' => json_encode(compact('csrf_token','base_url'))]
  );
})->where(['path'=>'.*']);
