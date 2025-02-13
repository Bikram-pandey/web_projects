ZMALoader.setOnLoad(function (mapOptions, error) {
    if (error) return console.error('ZMALoader error:', error);

    const mapElement = document.getElementById('ZMap');
    mapOptions.center = new ZDC.LatLng(35.681406, 139.767132); // 中心点の緯度経度（東京駅）
    mapOptions.mouseWheelReverseZoom = true;  //★マウスホイールのズーム方向の反転を指定
    mapOptions.zoom = 15;

    const map = new ZDC.Map(mapElement, mapOptions, function () {
        map.addControl(new ZDC.ZoomButton('top-left'));
        map.addControl(new ZDC.ScaleBar('bottom-left'));

        const start = new ZDC.LatLng(35.6750, 139.7630); // 有楽町駅
        const end = new ZDC.LatLng(35.6853, 139.7844); // 人形町
        map.addWidget(new ZDC.Marker(start, { styleId: ZDC.MARKER_COLOR_ID_BLUE_L }));
        map.addWidget(new ZDC.Marker(end, { styleId: ZDC.MARKER_COLOR_ID_YELLOW_L }));

        const routeUrl = `https://test-web.zmaps-api.com/route/route_mbn/walk?search_type=4&from=${start.lng},${start.lat}&to=${end.lng},${end.lat}&llunit=dec&datum=JGD`;

        fetch(routeUrl, {
            method: 'GET',
            headers: {
                'x-api-key': 'O8iPysCxWSagAdi6h70ub7I3DreHA5Qi7EEyUorM',
                'Authorization': 'ip'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK' && data.result?.item?.length) {
                    console.log(data)
                    const decodedPath = [];

                    data.result.item[0]?.route?.section?.forEach(section => {
                        section?.link?.forEach(link => {
                            link?.line?.coordinates?.forEach(coord => {
                                decodedPath.push(new ZDC.LatLng(coord[1], coord[0]));
                            });
                        });
                    });

                    if (decodedPath.length > 0) {
                        const routeLine = new ZDC.Polyline(decodedPath, { color: 'blue', width: 4, opacity: 1 });
                        map.addWidget(routeLine);
                    } else {
                        console.error('Decoded path is empty.');
                    }
                } else {
                    console.error('Route search failed:', data.status);
                }
            })
            .catch(error => {
                console.error('ルート検索エラー:', error);
            });
    }, function () {
        console.error('地図の生成に失敗しました');
    });
});
