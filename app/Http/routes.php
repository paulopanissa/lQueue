<?php

/**
 * AngularJS SPA
 */
Route::get('/', function(){
    return view('master');
});


/**
 * Simples Routes
 */
Route::get('/list-to-queue', 'HomeController@listToQueue');
Route::post('/add-in-queue', 'HomeController@addInQueue');

/**
 * Login
 */
Route::get('/login', function(){
    return redirect('#/login');
});


Route::group(['prefix' => 'api'], function(){
    /**
     * Authenticate
     */
    Route::post('authenticate', 'Api\AuthController@authenticate');
    Route::get('authenticate/user', 'Api\AuthController@getAuthenticatedUser');


    Route::group(['prefix' => 'queue'], function(){
       Route::get('', 'Api\QueueController@getInQueue');
       Route::post('/call', 'Api\QueueController@postCallQueue');
       Route::post('/again', 'Api\QueueController@postCallQueueAgain');
       Route::put('/status/{id}', 'Api\QueueController@putUpdateQueue');
    });
});

