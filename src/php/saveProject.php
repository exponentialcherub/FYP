<?php 

$post = file_get_contents('php://input');

$myfile = fopen("C:\\Users\\liams\\OneDrive\\Documents\\FYP\\projects\\" . date("mdYhis") . ".json", "w");
fwrite($myfile, $post);

?>