<?php

namespace App\Http\Controllers\Api;

use App\Repositories\QueueRepository;
use App\WebServer;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class QueueController extends Controller
{

    protected $queueRepository;

    protected $websocket;

    public function __construct(QueueRepository $repository, WebServer $webServer)
    {
        $this->queueRepository = $repository;
        $this->websocket = $webServer;
    }

    public function getInQueue()
    {
        return $this->queueRepository->inQueue();
    }

    public function postCallQueue(Request $request)
    {
        $callQueue = $this->queueRepository->callQueue($request->input('id'), $request->input('user_id'));
        return response()->json($callQueue);

    }

    public function postCallQueueAgain(Request $request)
    {
        $callQueue = $this->queueRepository->callQueue($request->input('id'));
        return response()->json($callQueue);
    }

    public function putUpdateQueue(Request $request, $id)
    {
        if ($this->queueRepository->changeStatus($id, $request->input('status_id'))) {
            return response()->json(['error' => false]);
        }
        return response()->json(['error' => true]);
    }
}
