<?php

namespace App\Http\Controllers;

use App\Repositories\QueueRepository;
use App\Models\Setting\SettingQueue;
use App\Http\Requests;
use Illuminate\Http\Request;


class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    public function listToQueue(SettingQueue $setting){
        return $setting::toQueue();
    }

    public function addInQueue(Request $request){
        $Queue = new QueueRepository();
        $inQueue = $Queue->addQueue($request->input('queue'));
        $toSave = [
            'id' => $inQueue->id,
            'pwd' => $inQueue->pwd,
            'queue' => $inQueue->queue->name,
            'created_at' => $inQueue->created_at,
        ];
        return response()->json($toSave);
    }

    public function findQueue($id){
        $Queue = new QueueRepository();
        $find = $Queue->findQueue($id);
        return response()->json($find);
    }

}
