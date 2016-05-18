<?php
/**
 * AngularJS SPA and Redirect to AngularJS
 */
Route::get('/', function(){ return view('master'); });
Route::get('/tv', function(){ return redirect('/#/tv'); });
Route::get('/login', function(){ return redirect('#/login'); });

/**
 * Simples Routes
 */
Route::get('/list-to-queue', 'HomeController@listToQueue');
Route::post('/add-in-queue', 'HomeController@addInQueue');
Route::get('/time-in-server', 'HomeController@timesInServer');


Route::group(['prefix' => 'api'], function(){
    /**
     * Authenticate
     */
    Route::post('authenticate', 'Api\AuthController@authenticate');
    Route::get('authenticate/user', 'Api\AuthController@getAuthenticatedUser');

    /**
     * Rotas Autenticadas pelo jwt
     */
    Route::group(['prefix' => 'queue', 'middleware'=> 'jwt.auth'], function(){
       Route::get('', 'Api\QueueController@getInQueue');
       Route::post('/call', 'Api\QueueController@postCallQueue');
       Route::post('/again', 'Api\QueueController@postCallQueueAgain');
       Route::put('/status/{id}', 'Api\QueueController@putUpdateQueue');
    });

    Route::group(['prefix' => 'users'], function(){
       Route::get('paginate', 'Api\UsersController@paginateUsers');
       Route::post('create', 'Api\UsersController@create');
       Route::get('{id}/edit', 'Api\UsersController@edit');
    });


    Route::group(['prefix' => 'setting', 'middleware' => 'jwt.auth'], function(){

        Route::resource('access', 'Api\Setting\AccessController', ['only' => ['index']]);

    });

});

