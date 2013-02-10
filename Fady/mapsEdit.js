4function run() {

  var ichacklocation = new google.maps.LatLng(51.499767, -0.176259);
    // ichacklocation = new google.maps.LatLng(51.499767, -0.176259);
    var myOptions = {
        zoom: 8,
        center: ichacklocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var geocoder = new google.maps.Geocoder();

var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';
      var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
      
    var request = {
        location: ichacklocation,
        radius: '500000',
        types: [
        'amusement_park',
        'aquarium',
        'art_gallery',
        'church', 'city_hall',
        'courthouse',
        'museum',
        'park',
        'shopping_mall',
        'university',
        'library',
        'establishment']
           };

      durationLimiter = secConverter(60);
      var map;
      var geocoder;
      var bounds = new google.maps.LatLngBounds();
      var markersArray = [];
      origin = 'Royal School of Mines, London';
      destinations = [
      'Buckingham Palace, London, England',
      'Trafalgar Square, London, England',
      'Picadilly Circus, London, England',
      'Hyde Park, London, England',
      'Covent Garden, London, England']

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      

      function callback(results, status) {
        places = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i], i);
          }
        }
      
	calculateDistances();
	}

      function createMarker(place, i) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
       places[i] = placeLoc;
      
	}

      google.maps.event.addDomListener(window, 'load', initialize);


	function calculateDistances() {
        	origin=prompt("please enter your location","");

        	var service = new google.maps.DistanceMatrixService();
	        service.getDistanceMatrix(
	          {
	            origins: [origin],
	            destinations: places,
	            travelMode: google.maps.TravelMode.WALKING,
	            unitSystem: google.maps.UnitSystem.METRIC,	
	            avoidHighways: false,
        	    avoidTolls: false
        	  }, callbackDuration);
      }

      function callbackDuration(response, status) {
 	     if (status != google.maps.DistanceMatrixStatus.OK) {
 	         alert('Error was: ' + status)
	       } else {
	          var origins = response.originAddresses;
	          var destinations = response.destinationAddresses;
	          // var outputDiv = document.getElementById('outputDiv');
	          // outputDiv.innerHTML = '';
	          deleteOverlays();

	          for (var i = 0; i < origins.length; i++) {
	            var results = response.rows[i].elements;
	            addMarker(origins[i], false);
	             for (var j = 0; j < results.length; j++) {
	                  if(results[j].duration.value<durationLimiter){
                    
	                       addMarker(destinations[j], true);
	                       // outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
	                       // + ': ' + results[j].distance.text + ' in '
	                       // + results[j].duration.text + '<br>'
	                       $( "#final" ).append(
	                       origins[i] + ' to ' + destinations[j]
	                       + ': ' + results[j].distance.text + ' in '
	                       + results[j].duration.text + '<br><br><br><br>'
	                       );
		          }//if
              	     } //inner for
                 }//out for
        }//else
      }//callbackDuration


//calculateDistances();

function deleteOverlays() {
        if (markersArray) {
          for (i in markersArray) {
            markersArray[i].setMap(null);
          }
          markersArray.length = 0;
        }
      }


      function addMarker(location, isDestination) {
        var icon;
        if (isDestination) {
          icon = destinationIcon;
        } else {
          icon = originIcon;
        }
        geocoder.geocode({'address': location}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            bounds.extend(results[0].geometry.location);
            map.fitBounds(bounds);
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            });
            markersArray.push(marker);
          } else {
            alert('Geocode was not successful for the following reason: '
              + status);
          }
        });
      }

        function secConverter(mins){// time is in mins
    return (mins*60);
        }
}
