<?php

namespace App;

use Ratchet\ConnectionInterface;
use Askedio\LaravelRatchet\RatchetServer;
use Ratchet\MessageComponentInterface;

class WebServer extends RatchetServer implements MessageComponentInterface{

    protected $clients;

    public function __construct(){
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
    
    public function onSend(ConnectionInterface $conn)
    {

    }

    public function doSend($send)
    {
        return ['send' => $send, 'chegou' => true];
    }
}