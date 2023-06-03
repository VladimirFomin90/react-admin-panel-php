<?php

$_POST = json_decode(file_get_contents("php://input"), true);

$page = "../../" . $_POST["name"];

if (file_exists($page)) {
    unlink($page);
} else {
    header("HTTP/1.0 400 Bad Request");
}