<?php

namespace App\Repositories;

use App\Models\Setting\SettingStatus;

class SettingStatusRepository
{
    protected $settingStatus;

    public function __construct(SettingStatus $settingStatus){
        $this->settingStatus = $settingStatus;
    }

}