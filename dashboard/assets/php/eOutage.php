<?php
/*
Alexander Bell-Towne

This PHP file returns data from eOutages 
*/

	// Create a stream
	$opts = array(
	  'http'=>array(
	    'method'=>"GET",
	  )
	);

	$context = stream_context_create($opts);

	// Open the file using the HTTP headers set above
	$file = file_get_contents('http://www.washington.edu/cac/outages/index.php', false, $context);
	$file = str_replace("/cac/outages/incs", "http://www.washington.edu/cac/outages/incs", $file);
	$file = str_replace("/home", "http://www.washington.edu/home", $file);
	$file = str_replace("/computing", "http://www.washington.edu/computing", $file);
	echo $file;

?>