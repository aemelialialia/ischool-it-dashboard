<?php
	date_default_timezone_set('America/Los_Angeles');
	$newData = json_decode(file_get_contents('http://tempmon.ischool.uw.edu/getData.json'), true);

	$timestamp = strtotime($newData[date]);
	$RackRear = $newData[sensor][0][tempf];
	$ACBlower = $newData[sensor][1][tempf];


	$line = $timestamp . "," . $RackRear . "," . $ACBlower . "\n";
	
	$success = file_put_contents('/nfs/bronfs/uwfs/hw00/d16/ihelp/tempmon/tempData.csv', $line, FILE_APPEND);
?>