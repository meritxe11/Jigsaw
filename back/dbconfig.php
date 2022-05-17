<?php
header('Access-Control-Allow-Origin: *');
$user = "didactxell";
$password = "didactxell";
$database = "sad";


$connection = mysqli_connect("localhost","$user","$password","$database") or die("Error " . mysqli_error($connection));
?>
