<?php
	require_once 'dbconfig.php';
	$usuario = $_GET["usuari"];
	$puntos = $_GET["punts"];

	$query =	"INSERT INTO `ranking` (`Nom`, `Punts`) VALUES ('{$usuario}', '{$puntos}');";
	$result = mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));

	$query =	"SELECT * FROM `ranking` ORDER BY `ranking`.`Punts` DESC LIMIT 3";
	$result = mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));

	$emparray1 = array();
  while($row = mysqli_fetch_assoc($result)) {
  	$emparray1[] = $row;
	}

	echo json_encode($emparray1);
	

	mysqli_close($connection);
?>
