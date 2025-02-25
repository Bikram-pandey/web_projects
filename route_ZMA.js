let map, streetView;

// Initialize ZMap API
ZMALoader.setOnLoad(function (mapOptions, error) {
    if (error) return console.error(error);

    mapOptions.center = new ZDC.LatLng(35.6672, 139.9856);
    mapOptions.mouseWheelReverseZoom = true;
    mapOptions.zoom = 12;

    map = new ZDC.Map(document.getElementById('ZMap'), mapOptions, function () {
        const start = new ZDC.LatLng(35.6329, 139.8804); // Tokyo Disneyland
        const destination = new ZDC.LatLng(35.7014, 140.0908); // Yachiyodai Station

        // Add controls
        map.addControl(new ZDC.ZoomButton('top-left'));
        map.addControl(new ZDC.ScaleBar('bottom-left'));

        // Add markers
        const startMarker = new ZDC.Marker(start, { styleId: ZDC.MARKER_COLOR_ID_BLUE_L });
        const endMarker = new ZDC.Marker(destination, { styleId: ZDC.MARKER_COLOR_ID_RED_L });
        map.addWidget(startMarker);
        map.addWidget(endMarker);

        map.addEventListener("click", function (event) {

            const latlon = event.latlng;
            console.log(latlon);
            initGoogleMaps(latlon);

        });

        // Fetch route from ZMap API
        fetch(`https://test-web.zmaps-api.com/route/route_mbn/drive_ptp?search_type=1&from=${start.lng},${start.lat}&to=${destination.lng},${destination.lat}&regulation_type=121200&toll_type=large`, {
            method: 'GET',
            headers: {
                'x-api-key': 'O8iPysCxWSagAdi6h70ub7I3DreHA5Qi7EEyUorM',
                'Authorization': 'referer'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK' && data.result?.item?.length > 0) {
                    console.log(data);
                    const decodedPath = data.result.item[0].route?.link?.flatMap(link => link.line.coordinates.map(coord => new ZDC.LatLng(coord[1], coord[0])));
                    if (decodedPath?.length) {
                        map.addWidget(new ZDC.Polyline(decodedPath, { color: "blue", width: 4, opacity: 1 }));
                    } else {
                        console.error("No decoded route data.");
                    }
                } else {
                    console.error("Failed to fetch route.", data);
                }
            })
            .catch(console.error);
    }, function () {
        console.error('Failed to generate the map.');
    });
});

// Initialize Google Street View
async function initGoogleMaps(latlon) {
    const default_Origin = { lat: 35.6329, lng: 139.8804 }; // Start point
    const is_latlon = latlon || default_Origin; // Use latlon if available, otherwise use default_Origin

    streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
        position: is_latlon,
        pov: { heading: 34, pitch: 10 },
        zoom: 1
    });
}

