<?php

namespace App\Http\Controllers\Api;

use App\Models\Queue\QueueManager;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class QueueController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api');
    }


    public function getInQueue(){
        return QueueManager::inQueue();
    }

    public function getCallQueue($id){

    }

    public function getCallQueueAgain($id){

    }

    public function getUpdateQueue($id, $status){

    }

}
