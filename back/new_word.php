<?php
	require_once 'dbconfig.php';
    $id = rand(1,332);
	$query = "SELECT `Word` FROM dictionary2 WHERE `Id` = '{$id}'";
	$result = mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));


    while($row = mysqli_fetch_assoc($result)) {
  		$data_to_send[] = $row;
	}

	echo json_encode([$data_to_send]);

	mysqli_close($connection);
?>
