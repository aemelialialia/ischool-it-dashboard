/*
Alexander Bell-Towne
*/

$( document ).ready(function() {
	main.load();
});

var main = (function() {

	var load = function() {
		clear();
		eOutages();
		clock(true);
		loadWeather('Seattle','');
		window.setInterval(function(){
			clock();
		}, 1000);
		$('#google_iframe').attr('src', $('#google_iframe').attr('src'));
		twitter();
	};

	var clear = function() {
		$('#clock').html('');
		$('#date').html('');
		$('#eOutage').html('');
	};

	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var mons = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
	var clock = function(first) {
		$('#clock').html('');
		var today=new Date();
				var h=today.getHours();
				var m=today.getMinutes();
				var s=today.getSeconds();
		h = h % 12;
				h= h ? h : 12; // the hour '0' should be '12'
				m = m < 10 ? '0'+m : m;
				$('#clock').text(h+((s%2)?' ':':')+m);
				$('#date').text(days[ today.getDay() ] + ', ' + months[ today.getMonth() ] + ' ' + today.getDate());
				if (s==0 || (first && s < 15)) {
					d3Temp('6hour');
				} else if (s==15 || (first && s < 30)) {
					d3Temp('2hour');
				} else if (s==30 || (first && s < 45)) {
					d3Temp('hour');
				} else if (s==45 || (first && s < 60)) {
					d3Temp('30min');
				};
	};

	var eOutages = function() {
		$.get( "assets/php/eOutage.php", 
		function(data){
			var html = $(data);
			var trimmed = html.find('.status');
			trimmed.find('div').attr('style', '');
			trimmed.find('img').attr('style', '');
			if ($(trimmed.children()[0]).html() != 'All systems operating normally.') {
				$('#inner').html(trimmed);
			} else {
				$('#eOutage').text('UW IT: All systems operating normally')
			};
		});
	};
	var twitter = function() {
		$.get( "assets/php/tweet2json.php", populateTweets);
	};

	function populateTweets(tweets){
		tweets = JSON.parse(tweets).tweets;
		
		for (var i = 0; i < tweets.length; i++) {
			var date = new Date(tweets[i].date*1000);
			var h=date.getHours();
					var m=date.getMinutes();
					var ampm = (h < 13 ? 'am' : 'pm');
			h = h % 12;
					h= h ? h : 12; // the hour '0' should be '12'
					m = m < 10 ? '0'+m : m;
			var formattedTime = date.getDate() + ' ' + mons[date.getMonth()] + ' ' + h + ':' + m + ' ' + ampm;

			var tweetDom = $('<div>');
			tweetDom.addClass('tweet '+((i % 2 == 0) ? 'Odd' : 'Even'));
			tweetDom.append('<div class="tweetTime">'+formattedTime+'</div>');
			tweetDom.append('<div class="">'+tweets[i].text.substring(36)+'</div>');
			$('#twitter').append(tweetDom);
		}
	};

	var d3Temp = function(timeframe) {
		$.get('../tempmon/?timeframe=' + timeframe).then(function(data) {
			data = JSON.parse(data);
			var tempData = data['data'];
			$('#labelTimeframe').text(data['timeframe']);
			initGraph(tempData);

		});
	};
	var initGraph = function(tempData) {
		var keys = [];
		var RackRear = [];
		var ACBlower = [];
		var minTemp = Number.MAX_VALUE;
		var maxTemp = 0;
		var minTime = Number.MAX_VALUE;
		var maxTime = 0;
		var downx = Math.NaN;
		var downscalex;

		for (var key in tempData['RackRear']) {
			keys.push(parseInt(key));
			maxTime = Math.max(maxTime, parseInt(key));
			minTime = Math.min(minTime, parseInt(key));
		}
		keys.sort();

		for (var i = 0; i < keys.length; i++) {
			maxTemp = Math.max(maxTemp, tempData['RackRear'][keys[i]], tempData['ACBlower'][keys[i]]);
			minTemp = Math.min(minTemp, tempData['RackRear'][keys[i]], tempData['ACBlower'][keys[i]]);
			
			RackRear.push({time:keys[i], temp: tempData['RackRear'][keys[i]]});
			ACBlower.push({time:keys[i], temp: tempData['ACBlower'][keys[i]]});
		}

		$('#graphLabelMin').text(parseInt(minTemp));
		$('#graphLabelMax').text(parseInt(maxTemp));

		var vis = d3.select("#tempGraph");
		var WIDTH = 1280,
			HEIGHT = 200,
			MARGINS = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 45
				},
			xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([minTime, maxTime]),
			yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([minTemp - 2, maxTemp + 2]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left");

		var area = d3.svg.area()
			.interpolate("basis")
			.x(function(d) { return xScale(parseInt(d.time)); })
			.y0(HEIGHT - MARGINS.bottom)
			.y1(function(d) { return yScale(parseInt(d.temp)); });
		vis.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", d3.rgb(0,132,171));
		vis.append("svg:path")
			.datum(RackRear)
			.attr("class", "RackRearArea")
			.attr("d", area);            
		vis.append("svg:path")
			.datum(ACBlower)
			.attr("class", "ACBlowerArea")
			.attr("d", area);            
		vis.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (MARGINS.left) + ",0)")
			.call(yAxis);
	};

	var loadWeather = function(location, woeid) {
		$.simpleWeather({
			location: location,
			woeid: woeid,
			unit: 'f',
			success: function(weather) {
				html = '<ul class="list-inline">';
				html += '<li><h1 style="margin-top:0;margin-bottom:0;"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h1></li>';
				html += '<li class="currently">'+weather.currently+', </li>';  
				html += '<li>'+weather.city+', '+weather.region+'</li>';
				html += '</ul>';
				
				$("#weather").html(html);
			},
			error: function(error) {
				$("#weather").html('<p>'+error+'</p>');
			}
		});
	};

	return {
		load: load
	};
}());
