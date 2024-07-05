<?php
$myCart = $_POST["myCart"];

require_once("easy_groceries.class.php");

$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->makeInvoice($myCart);

header("Content-Type: application/json");

echo $data;

?>
