const start = { lat: 35.681406, lng: 139.767132 }; // 東京駅
const waypoint1 = { lat: 35.658034, lng: 139.701636 }; // 渋谷
const waypoint2 = { lat: 35.6893, lng: 139.7054 }; //  新宿高等学校
const destination = { lat: 35.6895, lng: 139.6917 }; // 東京都庁舎

ZMALoader.setOnLoad(function (mapOptions, error) {
    if (error) return console.error(error);

    mapOptions.center = new ZDC.LatLng(35.681406, 139.767132); // 中心点の緯度経度（東京駅）
    mapOptions.mouseWheelReverseZoom = true;  //★マウスホイールのズーム方向の反転を指定
    mapOptions.zoom = 14;

    map = new ZDC.Map(document.getElementById('ZMap'), mapOptions, function () {
        // コントロールを追加
        map.addControl(new ZDC.ZoomButton('top-left'));
        map.addControl(new ZDC.ScaleBar('bottom-left'));

        // Add markers for start, waypoint, and destination
        map.addWidget(new ZDC.Marker(new ZDC.LatLng(start.lat, start.lng), { styleId: ZDC.MARKER_COLOR_ID_BLUE_L }));
        map.addWidget(new ZDC.Marker(new ZDC.LatLng(destination.lat, destination.lng), { styleId: ZDC.MARKER_COLOR_ID_RED_L }));
        map.addWidget(new ZDC.Marker(new ZDC.LatLng(waypoint1.lat, waypoint1.lng), { styleId: ZDC.MARKER_COLOR_ID_GREEN_L }));
        map.addWidget(new ZDC.Marker(new ZDC.LatLng(waypoint2.lat, waypoint2.lng), { styleId: ZDC.MARKER_COLOR_ID_YELLOW_L })); // New waypoint

        // ウェイポイントを API リクエストの 1 つのパラメータに結合します
        const waypoints = `${waypoint1.lng},${waypoint1.lat},${waypoint2.lng},${waypoint2.lat}`;

        // Fetch optimal route with multiple waypoints
        fetch(`https://test-web.zmaps-api.com/route/route_mbn/drive_tsp?search_type=1&from=${start.lng},${start.lat}&to=${destination.lng},${destination.lat}&waypoint=${waypoints}`, {
            method: 'GET',
            headers: {
                'x-api-key': 'O8iPysCxWSagAdi6h70ub7I3DreHA5Qi7EEyUorM',
                'Authorization': 'ip'
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
