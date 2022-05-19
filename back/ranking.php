<?php
	require_once 'dbconfig.php';
	$usuario = $_GET["usuari"];
	$puntos = $_GET["punts"];

	$query =	"INSERT INTO `ranking` (`Nom`, `Punts`) VALUES ('{$usuario}', '{$puntos}');";
	$result = mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));

	mysqli_close($connection);
?>
