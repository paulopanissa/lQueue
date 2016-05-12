<?php

namespace App\Repositories;

use App\Models\Queue\QueueManager;
use App\Models\Setting\SettingQueue;
use App\Models\Setting\SettingStatus;

class SettingQueueRepository
{
    protected $settingQueue;

    public function __construct(SettingQueue $settingQueue){
        $this->settingQueue = $settingQueue;
    }

    public function toQueue(){
        return $this->settingQueue->toQueue();
    }

    public function setQueue($queue){
        return $this->settingQueue->setQueue($queue);
    }
}