<?php

namespace App\Http\Controllers;

use App\Repositories\QueueRepository;
use App\Models\Setting\SettingQueue;
use App\Http\Requests;
use App\Repositories\SettingQueueRepository;
use Illuminate\Http\Request;


class HomeController extends Controller
{

    protected $respository;

    public function __construct(QueueRepository $repository){
        $this->respository = $repository;
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    public function listToQueue(SettingQueueRepository $setting){
        return $setting->toQueue();
    }

    public function addInQueue(Request $request){

        $inQueue = $this->respository->addQueue($request->input('queue'));
        $toSave = [
            'id' => $inQueue->id,
            'pwd' => $inQueue->pwd,
            'queue_id' => $inQueue->queue_id,
            'queue' => $inQueue->queue->name,
            'created_at' => $inQueue->created_at,
        ];
        return response()->json($toSave);
    }

    public function timesInServer(){
        $serverTime = time() * 1000;
        return $serverTime;
    }

    public function findQueue($id){
        $Queue = new QueueRepository();
        $find = $Queue->findQueue($id);
        return response()->json($find);
    }

}
