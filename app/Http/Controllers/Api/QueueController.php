<?php

namespace App\Http\Controllers\Api;

use App\Repositories\QueueRepository;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class QueueController extends Controller
{
    protected $queueRepository;
    public function __construct(QueueRepository $repository){
        $this->queueRepository = $repository;
    }

    public function getInQueue(){
        return $this->queueRepository->inQueue();
    }

    public function postCallQueue(Request $request){
        return $this->queueRepository->callQueue($request->input('id'), $request->input('user_id'));

    }

    public function postCallQueueAgain(Request $request){
        return $this->queueRepository->callQueue($request->input('id'));
    }

    public function putUpdateQueue(Request $request, $id){
        dd($request->all());
        return $this->queueRepository->changeStatus($id, $request->input('status'));
    }

}
