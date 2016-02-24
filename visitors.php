<?php
$ip = $_SERVER['REMOTE_ADDR'];
$date = date_create();
$d = date_timestamp_get($date);

$file = 'visitors.log';
$current = file_get_contents($file);
$current .= "$d|$ip\n";
file_put_contents($file, $current);
?>
