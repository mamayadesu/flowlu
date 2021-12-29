<?php
header("Content-Type: text/plain");
session_start();
function brackets(string $str) : bool
{
    $length = strlen($str);
    
    $stack = [];
    $stackCount = 0;
    $bracketsEquivalents = array
    (
        "(" => ")",
        "{" => "}",
        "[" => "]",
        "<" => ">"
    );
    for ($i = 0; $i < $length; $i++)
    {
        $stackCount = count($stack);
        switch ($str[$i])
        {
            case "(":
            case "{":
            case "[":
            case "<":
                $stack[] = $str[$i];
                break;
            
            case ")":
            case "}":
            case "]":
            case ">":
                if ($stackCount == 0 || $str[$i] != $bracketsEquivalents[$stack[$stackCount - 1]])
                {
                    return false;
                }
                
                array_pop($stack);
                break;
        }
    }
    return (count($stack) == 0);
}

if (! isset($_POST["query"]))
{
    die(json_encode(array("success" => false, "error" => "Query is empty")));
}

require "db.php";

if ($db->connect_errno != 0)
{
    die(json_encode(array("success" => false, "error" => "Failed to connect to database. " . $db->connect_error)));
}

$result = brackets($_POST["query"]);

echo json_encode(array("success" => $result));

$insert = "INSERT INTO `history` (`php_session_id`, `query`, `is_success`, `date`) VALUES
('" . $db->real_escape_string(session_id()) . "', '" . $db->real_escape_string($_POST["query"]) . "', " . ($result ? "1" : "0") . ", " . time() . ")
";

$db->query($insert);

$db->close();