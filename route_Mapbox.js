// Mapboxの初期化
mapboxgl.accessToken = 'pk.eyJ1IjoiemVucmlucWlpdGEiLCJhIjoiY202cjhnejFoMXI1NDJxc2hjM3F6dTE5dSJ9.ECmp3Rtb73PvXbT8TTCEVw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [139.6917, 35.6895], // 東京の座標
    zoom: 10
});


const nav = new mapboxgl.NavigationControl();
// top-right'で右上に配置されます
map.addControl(nav, 'top-left');

// 開始点、終了点、ウェイポイント
const startingPoint = [139.767132, 35.681406]; // 東京駅
const waypoint1 = [139.701636, 35.658034]; // 渋谷
const waypoint2 = [139.7054, 35.6893]; //  新宿高等学校
const endingPoint = [139.6917, 35.6895]; // 東京都庁舎

// マーカーを配置
[new mapboxgl.Marker({ color: 'blue' }).setLngLat(startingPoint),
new mapboxgl.Marker({ color: 'green' }).setLngLat(waypoint1),
new mapboxgl.Marker({ color: 'yellow' }).setLngLat(waypoint2),
new mapboxgl.Marker({ color: 'red' }).setLngLat(endingPoint)]
    .forEach(marker => marker.addTo(map));


// Optimized Trips APIを使用してルートを計算
async function calculateOptimizedRoute() {
    // 座標を「;」で連結してAPIに渡す
    const coordinates = [startingPoint, waypoint1, waypoint2, endingPoint].map(coord => coord.join(',')).join(';');
    // Optimized Trips APIのURL
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}&source=first&destination=last&roundtrip=false`;

    try {
        // APIリクエストを送信
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // ルート計算の成功を確認   
        if (data.code !== 'Ok') {
            throw new Error(`ルート計算エラー: ${data.message}`);
        }

        const route = data.trips[0].geometry;

        // 既存のルートを削除（必要に応じて）
        if (map.getLayer('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }

        // ルートを地図に表示
        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: route,
            }
        });

        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': 'blue',
                'line-width': 4
            }
        });
    } catch (error) {
        console.error('ルート計算エラー:', error);
    }
}

// ページロード時にルートを計算
calculateOptimizedRoute();

