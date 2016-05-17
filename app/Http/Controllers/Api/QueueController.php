<?php

namespace App\Http\Controllers\Api;

use App\Repositories\QueueRepository;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class QueueController extends Controller
{
    /**
     * @var QueueRepository
     */
    protected $queueRepository;

    /**
     * QueueController constructor.
     * @param QueueRepository $repository
     */
    public function __construct(QueueRepository $repository)
    {
        $this->queueRepository = $repository;
    }

    /**
     * @return mixed
     */
    public function getInQueue()
    {
        return $this->queueRepository->inQueue();
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCallQueue(Request $request)
    {
        $callQueue = $this->queueRepository->callQueue($request->input('id'), $request->input('user_id'));
        return response()->json($callQueue);

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postCallQueueAgain(Request $request)
    {
        $callQueue = $this->queueRepository->callQueue($request->input('id'));
        return response()->json($callQueue);
    }

    /**
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdateQueue(Request $request, $id)
    {
        if ($this->queueRepository->changeStatus($id, $request->input('status_id'))) {
            return response()->json(['error' => false]);
        }
        return response()->json(['error' => true]);
    }
}
