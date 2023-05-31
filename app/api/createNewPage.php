<?php

$newPage = "../../" . $_POST["name"] . ".html";

if (file_exists($newPage)) {
    header("HTTP/1.0 400 Bad Request");
} else {
    fopen($newPage, "w");
}