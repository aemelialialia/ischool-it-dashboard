<?php
	date_default_timezone_set("America/Los_Angeles");
	$folderName = "/nfs/bronfs/uwfs/hw00/d16/ihelp/tempmon/tempData/" . date("Y");
	$fileName = "/nfs/bronfs/uwfs/hw00/d16/ihelp/tempmon/tempData/" . date("Y/F") . ".csv";

	if (!is_dir("/nfs/bronfs/uwfs/hw00/d16/ihelp/tempmon/tempData")) {
		// dir doesn"t exist, make it
		mkdir("/nfs/bronfs/uwfs/hw00/d16/ihelp/tempmon/tempData");
	}

	if (!is_dir($folderName)) {
		// dir doesn"t exist, make it
		mkdir($folderName);
	}

	if(!file_exists($fileName)) {
		file_put_contents($fileName, "timestamp,RackRear,ACBlower\n");
	}

	$newData = json_decode(file_get_contents("http://tempmon.ischool.uw.edu/getData.json"), true);

	$timestamp = strtotime($newData["date"]);
	$RackRear = $newData["sensor"][0]["tempf"];
	$ACBlower = $newData["sensor"][1]["tempf"];


	$line = $timestamp . "," . $RackRear . "," . $ACBlower . "\n";

	$success = file_put_contents($fileName, $line, FILE_APPEND);
?>
