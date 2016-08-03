<?php
	date_default_timezone_set('America/Los_Angeles');
	
	$timeframe = $_GET['timeframe'];
	$timeframePretty = '';
	switch ($timeframe) {
		case 'year':
			$start = strtotime("-1 year");
			$timeframePretty = 'Last Year';
			break;
		case 'week':
			$start = strtotime("-1 week");
			$timeframePretty = 'Last Week';
			break;
		case 'day':
			$start = strtotime("-1 day");
			$timeframePretty = 'Last Day';
			break;
		case '12hour':
			$start = strtotime("-12 hour");
			$timeframePretty = 'Last 12 Hours';
			break;
		case '6hour':
			$start = strtotime("-6 hour");
			$timeframePretty = 'Last 6 Hours';
			break;
		case '2hour':
			$start = strtotime("-2 hour");
			$timeframePretty = 'Last 2 Hours';
			break;
		case 'hour':
			$start = strtotime("-1 hour");
			$timeframePretty = 'Last Hour';
			break;
		case '30min':
			$start = strtotime("-30 min");
			$timeframePretty = 'Last 30 Mins';
			break;
	}
	$csvFile = file('tempData.csv');
	$data = [];
	foreach ($csvFile as $line) {
		$lineData = str_getcsv($line);
		$data[$lineData[0]] = [
			$lineData[1],
			$lineData[2]
		]
	}

	// remove column header row
	unset($data['timestamp']);

	$filteredData = array(
		'RackRear' => array(),
		'ACBlower' => array()
	);

	foreach ($data as $timestamp => $array) {
		if (strval($timestamp) > strval($start)) {
			$filteredData[RackRear][$timestamp] = $array[0];
			$filteredData[ACBlower][$timestamp] = $array[1];
		}
	}

	$return = array(
		'timeframe' => $timeframePretty,
		'data' => $filteredData
	);

	print_r(json_encode($return));
?>
