<?php 

// Loads project with name sent by client.

$post = file_get_contents('php://input');
$data = json_decode($post);
$dir = "C:\\Users\\liams\\OneDrive\\Documents\\FYP\\projects\\" . $data->filename;

if (file_exists($dir))
{
    $saveFile = fopen($dir, "r");
    $contents = fread($saveFile, filesize($dir));
    echo($contents);
}

?>