<?php 

$htmlFiles = glob("../../*.html");

$response = [];
foreach ($htmlFiles as $fileName) {
    array_push($response, basename($fileName)) ;
}

echo json_encode($response);