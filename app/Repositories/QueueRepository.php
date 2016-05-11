<?php

namespace App\Repositories;

use App\Models\Queue\QueueManager;
use App\Models\Setting\SettingQueue;

class QueueRepository {

    protected $queueManager;

    protected $settingQueue;

    protected $settingStatus;

      /**
     * Add in Queue
     * @param $queue
     * @return static
     */
    public function addQueue($queue){
        $info  = SettingQueue::setQueue($queue);
        $count = QueueManager::countQueue($queue);
        $password = getQueueNumber($info->key, $count);
        $store = [
            'pwd' => $password,
            'queue_id' => $queue,
            'status_id' => 1
        ];
        $save = QueueManager::create($store);
        return $this->findQueue($save->id);
    }

    public function findQueue($id){
        $find = QueueManager::find($id);
        return $find;
    }
}