<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function(){
       return view('master');
});

/**
 * Simples Routes
 */
Route::get('/list-to-queue', 'HomeController@listToQueue');
Route::post('/add-in-queue', 'HomeController@addInQueue');

Route::get('/find-queue/{id}', 'HomeController@findQueue');


/**
 * API
 */
Route::group(['prefix' => 'api/v1', 'middleware'=>['auth:api']], function(){
       Route::get('/home', function(){
              $user = \Illuminate\Support\Facades\Auth::guard('api')->user();
              return view('home')->with(compact('user'));
       });
});

