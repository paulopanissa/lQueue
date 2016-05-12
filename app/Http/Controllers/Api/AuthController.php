<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Auth;
use JWTAuth;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }

    public function authenticate(Request $request)
    {
        $this->validate($request, [
           'username' => 'required|exists:users',
           'password' => 'required|min:4'
        ], [
            'username.required' => 'Favor digite seu usuário',
            'username.exists' => 'Você não está registrado, contate um administrador.',
            'password,required' => 'Favor digite sua senha.'
        ]);

        $credentials = $request->only('username', 'password');
        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function getAuthenticatedUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }
}
