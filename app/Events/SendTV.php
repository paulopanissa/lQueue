<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class SendTV extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($values)
    {
        $this->data = compact("values");
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['send-to-tv'];
    }
}
