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

Route::get('/', ['as' => 'home', 'uses' => 'PaymentController@index']);
Route::post('/create', ['as' => 'create', 'uses' => 'PaymentController@create']);
Route::get('/search', ['as' => 'search', 'uses' => 'PaymentController@search']);

