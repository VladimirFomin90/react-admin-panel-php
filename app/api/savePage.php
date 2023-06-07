<?php

$_POST = json_decode(file_get_contents("php://input"), true);

$page = "../../" . $_POST["pageName"];
$newHTML = $_POST["html"];

if ($newHTML && $page) {
    file_put_contents($page, $newHTML);
} else {
    header("HTTP/1.0 400 Bad Request");
}