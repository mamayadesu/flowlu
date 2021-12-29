<?php
require "db.php";
session_start();
header("Content-Type: text/plain");

if ($db->connect_errno != 0)
{
    die(json_encode(array("error" => "Failed to connect to database. " . $db->connect_error)));
}

$query = $db->query("SELECT `query`, `is_success`, `date` FROM `history` WHERE `php_session_id`='" . session_id() . "' ORDER BY `date` DESC");

$data = [];
$arr = array();

while ($row = $query->fetch_array())
{
    $arr = array
    (
        "expression" => $row["query"],
        "is_success" => ($row["is_success"] == 1),
        "date" => date("H.m.Y H:i:s", $row["date"])
    );
    
    $data[] = $arr;
}

echo json_encode($data, JSON_PRETTY_PRINT);
$db->close();