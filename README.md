# Project name

iSchool IT Dashboard

# Short Description

A dashboard style website built for the iSchool IT TV 
pulls in data from around the web and internal sensors

# How it works

There are three main sites
- The Dashboard which is the actual dashboard you see
- The is-ittv page which shows a rotating slideshow of webpages, including some animal cams.
- The scrapping script and API
	- The script, `tempmon\scrape.php` should be scheduled to run at 5 minute intervals via a cron job
		- This will save the latest temp data in the `tempData.csv` file
	- The API is accessed via the `tempmon\index.php` file and accepts one parameter, `timeframe`, which must be one of.
		- `30min`
		- `hour`
		- `2hour`
		- `6hour`
		- `12hour`
		- `day`
		- `week`
		- `year`
	- An example call to this api would look like this `../tempmon/?timeframe=30min` which would return a json object containing the last 30 minutes of temperature data.

