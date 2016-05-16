<?php

namespace App\Http\Controllers\Api\Setting;

use App\Models\Setting\Access;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class AccessController extends Controller
{

    public function index()
    {
        return Access::all();
    }

}
