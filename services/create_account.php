<?php

// GET LIST OF PRODUCTS BY CATEGORY

$username = $_POST["email"];
$username = addslashes($username);

$password = $_POST["password"];
$password = addslashes($password);

$name_first = $_POST["name_first"];
$name_first = addslashes($name_first);

$name_last = $_POST["name_last"];
$name_last = addslashes($name_last);

$billing_address = $_POST["billing_address"];
$billing_address = addslashes($billing_address);

$billing_city = $_POST["billing_city"];
$billing_city = addslashes($billing_city);

$billing_province = $_POST["billing_province"];
$billing_province = addslashes($billing_province);

$billing_postal_code = $_POST["billing_postal_code"];
$billing_postal_code = addslashes($billing_postal_code);

$billing_phone = $_POST["billing_phone"];
$billing_phone = addslashes($billing_phone);

require_once("easy_groceries.class.php");

$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->createAccount($username,$password,$name_first,$name_last,$billing_address,$billing_city,$billing_province,$billing_phone,$billing_postal_code);

header("Content-Type: application/json");

echo $data;

?>
