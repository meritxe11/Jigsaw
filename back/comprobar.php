<?php
	require_once 'dbconfig.php';
	$palabra = $_GET["palabra"];
	$query = "SELECT `Palabra` FROM diccionario WHERE `Palabra` = '{$palabra}'";
	$result = mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));
	$emparray1 = array();

  while($row = mysqli_fetch_assoc($result)) {
  	$emparray1[] = $row;
	}

	if(count($emparray1) != 0) {
		$data_to_send =  array("true");
	} else {
		$data_to_send =  array("false");
	}

	echo json_encode(['word' => $data_to_send]);

	mysqli_close($connection);
?>
