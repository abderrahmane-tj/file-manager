<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/folder/{id?}', 'FoldersController@contents');

// get folder contents by guessing from path
Route::get('/folder-from-path/{path?}', 'FoldersController@contentsFromPath')
  ->where(['path'=>'.*']);

// get file details
Route::get('/file/{id}', 'FilesController@details');


// create new foloder
Route::post('/folder', 'FoldersController@store');


Route::post('/upload/{id?}','FilesController@upload');