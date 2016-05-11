<?php
function getQueueNumber($keyName, $number){
    $number += 1;
    $queueNumber = str_pad($number, 3, "0", STR_PAD_LEFT);
    return $keyName . '-' . $queueNumber;
}