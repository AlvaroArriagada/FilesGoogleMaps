window.onload = function() {    
    // Initialization
    var map;
    var markers = [];

    // Here we define each layer
    var layers = [{
    title: '4G Argentina',
    value: '0',
    url: 'http://lascano.com.ar/4G.kmz'
    },
    {
    title: 'Antenas',
    value: '1',
    url: 'http://lascano.com.ar/Antenas.kmz'
    },
    {
    title: 'Polígonos',
    value: '2',
    url: 'http://lascano.com.ar/Poligonos.kmz'
    },
    {
    title: 'Puntos Enacom',
    value: '3',
    url: 'http://lascano.com.ar/Enacom.kmz'
    }];

    // Main function
    function initMap() {
    // Instantiate a new Google Maps
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: -34, lng: -60}
    });
    
    // Create the search box and link it to the UI element
    var searchBoxInput = document.getElementById('search-box');
    
    // Define a filter to only show locations on the search box
    var optionsSearchBox = {
        types: ['(cities)']
    };

    var searchBox = new google.maps.places.SearchBox(searchBoxInput, optionsSearchBox);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxInput);
    
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
        return;
        };
        // Clear out the old markers
        markers.forEach(function(marker) {
        marker.setMap(null);
        });

        markers = [];

        // For each place, get the icon, name and location
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
        if (!place.geometry) {
            return;
        }
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
        }));
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        });
        map.fitBounds(bounds);
    });
    
    // Create the layer selector and link it to the UI element
    var listLayerSelector = document.getElementById('layer-selector');
    map.controls[google.maps.ControlPosition.LEFT].push(listLayerSelector);
        
    // For each element on the array
    layers.forEach(function(el, index) {
        // Append a checkbox for each element
        $('#layer-selector').append('<input class="layer-input" type="checkbox" value="'
        + el.value + '" onclick = "showOrHideMap(this)" checked="true">'
        + el.title + '<br>');
        
        // Create Layer
        this['layer_' + index] = new google.maps.KmlLayer({
        map: map,
        preserveViewport: true,
        url: el.url
        });
    })
    };

    function showOrHideMap(el) {
    if (!el.checked) {
        this['layer_' + el.value].setMap(null);
    } else {
        this['layer_' + el.value].setMap(map);
    }
    }

    initMap();
}
