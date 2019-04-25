<?php 

$post = file_get_contents('php://input');
$data = json_decode($post);
$projectId = "";

if(!property_exists($data, 'projectId'))
{
    $projectId = date("mdYhis") . ".json";
}
else
{
    $projectId = $data->projectId;
}

$myfile = fopen("C:\\Users\\liams\\OneDrive\\Documents\\FYP\\projects\\" . $projectId, "w");
fwrite($myfile, $post);
fclose($myfile);

?>