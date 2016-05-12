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

Route::get('/fire', function(){
   Event::fire(new \App\Events\SendTV('Teste message for event'));
   return 'Event Fired';
});

Route::get('/', function(){
       return view('master');
});

/**
 * Simples Routes
 */
Route::get('/list-to-queue', 'HomeController@listToQueue');
Route::post('/add-in-queue', 'HomeController@addInQueue');


/**
 * Authenticate API
 */
Route::post('api/authenticate', 'Auth\AuthController@AuthAPI');
Route::get('api/logout', 'Auth\AuthController@AuthLogout');

/**
 * API
 */
Route::group(['prefix' => 'api/v1', 'middleware'=>['auth:api']], function(){
    Route::group(['prefix' => 'queue'], function(){
       Route::post('', 'Api\QueueController@getInQueue');
    });
});

