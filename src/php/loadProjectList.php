<?php 

$projects = array();
$dir = "C:\\Users\\liams\\OneDrive\\Documents\\FYP\\projects\\";

if (is_dir($dir))
{
    if ($dh = opendir($dir)){
        $i = 0;
        // Iterate through each project in the directory and return information on all of them.
        while (($file = readdir($dh)) !== false){
            if(!is_dir($file))
            {
                $saveFile = fopen($dir . "\\" . $file, "r");
                $contents = fread($saveFile, filesize($dir . "\\" . $file));
                $jsonObj = json_decode($contents);

                $projects[$i] = new stdClass();
                $projects[$i]->projectId = $file;
                $projects[$i]->projectName = $jsonObj->projectName;
                $projects[$i]->author = $jsonObj->author;
                $projects[$i]->description = $jsonObj->description;

                fclose($saveFile);
                $i++;
            }
        }
        closedir($dh);
    }
}

echo(json_encode($projects));

?>