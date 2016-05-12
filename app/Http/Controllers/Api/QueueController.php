<?php

namespace App\Http\Controllers\Api;

use App\Models\Queue\QueueManager;
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

    public function putCallQueue($id){
        $update = $this->queueRepository->find($id);
        $update->status_id = 2;
        $update->save();


    }

    public function putCallQueueAgain($id){

    }

    public function putUpdateQueue($id, $status){

    }

}
