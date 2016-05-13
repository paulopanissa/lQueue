<?php

namespace App\Repositories;

use App\Models\Queue\QueueManager;

class QueueRepository {
    /**
     * @var QueueManager
     */
    protected $queueManager;
    /**
     * @var SettingQueue
     */
    protected $settingQueue;
    /**
     * @var SettingStatus
     */
    protected $settingStatus;


    public function __construct(QueueManager $queueManager, SettingQueueRepository $settingQueueRepository, SettingStatusRepository $settingStatusRepository){
        $this->queueManager = $queueManager;
        $this->settingQueue = $settingQueueRepository;
        $this->settingStatus = $settingStatusRepository;
    }
      /**
     * Add in Queue
     * @param $queue
     * @return static
     */
    public function addQueue($queue){
        $info  = $this->settingQueue->setQueue($queue);
        $count = $this->queueManager->countQueue($queue);
        $password = getQueueNumber($info->key, $count);
        $store = [
            'pwd' => $password,
            'queue_id' => $queue,
            'status_id' => 1
        ];
        $save = $this->queueManager->create($store);
        return $this->findQueue($save->id);
    }

    /**
     * Find Queue
     * @param $id
     * @return mixed
     */
    public function findQueue($id){
        return $this->queueManager->find($id);
    }

    /**
     * In Queue
     * @return mixed
     */
    public function inQueue(){
        return $this->queueManager->inQueue();
    }
    
    public function callQueue($id, $user = null){
        $queue = $this->findQueue($id);
        $queue->status_id = 2;
        $queue->user_id = ($user!=null) ? $user : $queue->user_id;
        if($queue->save()){
            $user = $queue->user()->first();
            $guiche = $user->tickets()->first();
            $doQueue = $queue->queue()->first();
            $toSend = [
              'id' => $queue->id,
              'senha' => $queue->pwd,
              'guiche' => $guiche->number,
              'atendimento' => $doQueue->name
            ];
            return $toSend;
        }
        
    }
    
    public function changeStatus($id, $status){
        $queue = $this->findQueue($id);
        $queue->status_id = $status;
        return $queue->save();
    }
}