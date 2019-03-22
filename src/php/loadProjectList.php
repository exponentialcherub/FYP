<?php 

$projects = array();
$dir = "C:\\Users\\liams\\OneDrive\\Documents\\FYP\\projects\\";

if (is_dir($dir))
{
    if ($dh = opendir($dir)){
        $i = 0;
        while (($file = readdir($dh)) !== false){
            if(!is_dir($file))
            {
                $projects[$i] = $file;
                $i++;
            }
        }
        closedir($dh);
    }
}

echo(json_encode($projects));

// TODO: Add more data to response from file, currently only file name.

?>