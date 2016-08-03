/*
Alexander Bell-Towne
*/

$( document ).ready(function() {
	var index = 1;

	var addresses = {
		0: {
			name: 'Dashboard',
			url: 'http://depts.washington.edu/ihelp/dashboard/',
			active: true
		},
		1: {
			name: 'Space Needle',
			url: 'http://50yrcamera.spaceneedle.net/',
			active: true
		},
		2: {
			name: 'Monterey bay Aquarium Sea Otter Cam',
			url: 'http://www.ustream.tv/embed/13659436?html5ui&autoplay=true',
			active: false
		},
		3: {
			name: 'Brooks Falls - Katmai National Park, Alaska - Bears',
			url: 'https://www.youtube.com/embed/-UW1ZwZpVzI?autoplay=1',
			active: false
		},
		4: {
			name: 'Pacific Reef Cam',
			url: 'http://www.ustream.tv/embed/13628077?html5ui=1&autoplay=true',
			active: false
		},
		5: {
			name: 'Puppy Cam - Warrior Canine Connection',
			url: 'https://www.youtube.com/embed/BH5FnM_dVvE?autoplay=1',
			active: false
		},
		6: {
			name: 'Watering Hole - Africa',
			url: 'http://www.ustream.tv/embed/17128998?html5ui=1&autoplay=true',
			active: false
		},
		7: {
			name: 'Humming Bird',
			url: 'http://www.ustream.tv/embed/13340773?html5ui=1&autoplay=true',
			active: false
		}

	};

	var checkKey = function(e) {

		e = e || window.event;

		console.log('pressed ' + index);

		if (e.keyCode == '38') {
			// up arrow
		}
		else if (e.keyCode == '40') {
			// down arrow
		}
		else if (e.keyCode == '37') {
			// left arrow
			moveLeft();
		}
		else if (e.keyCode == '39') {
			// right arrow
			moveRight();
		}
	}

	var moveLeft = function() {
		console.log('left');
		index = switch_view(index - 2);
	}

	var moveRight = function() {
		console.log('right');
		index = switch_view(index);
	}

	var switch_view = function(index) {
		if (index < 0) {
			index = index + Object.keys(addresses).length;
		};

		while (!addresses[index].active) {
			index++;
			if (index == Object.keys(addresses).length) {
				index = 0;
			};
		}
		
		$('#iframe').attr('src', addresses[index].url);

		index++;

		if (index == Object.keys(addresses).length) {
			index = 0;
		};

		return index;
	}

	var gear = function() {
		$('#check-list-box').empty();
		$('#error').empty();
		for (var i in addresses) {
			// console.log(addresses[i].active);
			var item = $('<li>')
				.addClass('list-group-item')
				.text(' ' + addresses[i].name)
				.data('id', i);
			if (addresses[i].active) {
				item.data('active', 'on');
			} else {
				item.data('active', 'off');
			}
			$('#check-list-box').append(item);
		}

		$('.list-group.checked-list-box .list-group-item').each(function () {
				
					// Settings
					var $widget = $(this),
							$checkbox = $('<input type="checkbox" class="hidden" />'),
							color = ($widget.data('color') ? $widget.data('color') : "primary"),
							style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
							settings = {
									on: {
											icon: 'glyphicon glyphicon-check'
									},
									off: {
											icon: 'glyphicon glyphicon-unchecked'
									}
							};
					$checkbox.prop('checked', $widget.data('active') == 'on');
					
					$widget.css('cursor', 'pointer')
					$widget.append($checkbox);

					// Event Handlers
					$widget.on('click', function () {
							$checkbox.prop('checked', !$checkbox.is(':checked'));
							$checkbox.triggerHandler('change');
							updateDisplay();
					});
					$checkbox.on('change', function () {
							updateDisplay();
					});
						

					// Actions
					function updateDisplay() {
							var isChecked = $checkbox.is(':checked');

							// Set the button's state
							$widget.data('state', (isChecked) ? "on" : "off");
							// Set the button's icon
							$widget.find('.state-icon')
									.removeClass()
									.addClass('state-icon ' + settings[$widget.data('state')].icon);

							// Update the button's color
							if (isChecked) {
									$widget.addClass(style + color + ' active');
							} else {
									$widget.removeClass(style + color + ' active');
							}
					}

					// Initialization
					function init() {
							
							if ($widget.data('checked') == true) {
									$checkbox.prop('checked', !$checkbox.is(':checked'));
							}
							
							updateDisplay();

							// Inject the icon if applicable
							if ($widget.find('.state-icon').length == 0) {
									$widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
							}
					}
					init();
			});
		
		$('#settings').modal('show');
	}

	$('#get-checked-data').on('click', function(event) {
				event.preventDefault(); 
				var checkedItems = [];
				$("#check-list-box li.active").each(function(idx, li) {
						checkedItems.push($(li).data('id'));
				});
				// console.log(checkedItems);

				if (checkedItems.length > 0) {
					for (var i in addresses) {
						addresses[i].active = false;
					}

					for (var i = 0; i < checkedItems.length; i++) {
						addresses[checkedItems[i]].active = true;
					}

					$('#settings').modal('hide');
				} else {
					$('#error').text('Please Pick atleast one site');
				}

					
		});


	window.setInterval(function(){
		console.log('main ' + index);
		index = switch_view(index);
	}, 140000);

	var getDocument_ = function(opt_domHelper) {
			return document.documentElement;
		};

	var requestFullScreen = function(element) {
		if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.requestFullscreen) {
			element.requestFullscreen();
		}
	};

	var exitFullScreen = function(opt_domHelper) {
		var doc = getDocument_(opt_domHelper);
		if (doc.webkitCancelFullScreen) {
			doc.webkitCancelFullScreen();
		} else if (doc.mozCancelFullScreen) {
			doc.mozCancelFullScreen();
		} else if (doc.msExitFullscreen) {
			doc.msExitFullscreen();
		} else if (doc.exitFullscreen) {
			doc.exitFullscreen();
		}
	};

	var isFullScreen = function(opt_domHelper) {
		var doc = getDocument_(opt_domHelper);
		// IE 11 doesn't have similar boolean property, so check whether
		// document.msFullscreenElement is null instead.
		return !!(
				doc.webkitIsFullScreen || doc.mozFullScreen || doc.msFullscreenElement ||
				doc.fullscreenElement);
	};

	var toggleFullScreen = function() {
		if (isFullScreen()) {
			exitFullScreen();
		} else {
			requestFullScreen(document);
		}
	}


	document.onkeydown = checkKey;
	document.getElementById('left').onclick = moveLeft;
	document.getElementById('right').onclick = moveRight;
	document.getElementById('gear').onclick = gear;
	document.getElementById('fullScreen').addEventListener("click", function() {
		var doc = dox;
			if (doc.webkitCancelFullScreen) {
			doc.webkitCancelFullScreen();
		} else if (doc.mozCancelFullScreen) {
			doc.mozCancelFullScreen();
		} else if (doc.msExitFullscreen) {
			doc.msExitFullscreen();
		} else if (doc.exitFullscreen) {
			doc.exitFullscreen();
		}
		
	});
});
