# Project Title

# Mapbox と ZENRINMapsAPI の最適巡回ルート比較してみた

## ゼンリン Maps API と Mapbox API のルート比較

ゼンリン Maps API と Mapbox API を使って、**東京駅 → 渋谷 → 新宿高等学校 → 東京都庁舎** のルートを計算した結果を比較しました。

## 1. ルートの距離と時間の比較

| API                   | 距離 (m)       | 時間 (分)          |
| --------------------- | -------------- | ------------------ |
| **ゼンリン Maps API** | **13,703.2 m** | 約 **約 48.56 分** |
| **Mapbox API**        | **13,315.3 m** | 約 **約 51.29 分** |

## 2. 比較結果

- **距離**: ゼンリン Maps API のほうが **約 388 m 長いルート** を提案しました。
- **時間**: ゼンリン Maps API は **48.56 分**、Mapbox API は **約 約 51.29 分** でした。

## 4. まとめ

ゼンリン Maps API は **日本国内の道路情報に最適化されており、精度が高いルートを提供** します。  
一方、Mapbox API は **世界中で利用でき、カスタマイズ性が高い** のが特徴です。

## はじめに

最適巡回ルートを計算する際、地図サービスや API の選択は非常に重要です。本記事では、Mapbox と ZENRINMapsAPI を使用して最適巡回ルートを比較してみました。  
それぞれのサービスの概要から API キーの取得方法、サンプルコードまでを解説します。

**対象読者**

-Web 開発者 - 地図 API を使って最適ルート計算をアプリに組み込みたい開発者。  
-物流・観光業の担当者 - 効率的なルート計算を導入したい方。  
-Mapbox と商用地図 API の違いを知りたい方。  
-学生・初心者 - 地図 API やルート計算の学習をしたい方。

## 両サービスの概要

**Mapbox**

Mapbox は世界的に有名な地図プラットフォームで、高速でカスタマイズ可能な地図描画が特徴です。　　　　  
最適ルート検索機能を備え、ナビゲーションシステムに適しています。

**ZENRINMapsAPI**

ZENRIN Maps API は日本国内で強みを持つ地図サービスです。

ゼンリンの詳細な地図データを使用しており、高精度なルート検索が可能です。

また、日本特有の道路情報にも対応しています。

## API キーの取得

**Mapbox**

**アクセストークンの取得方法**
利用する前に規約確認が必要なので規約の詳細については、公式サイトで確認してください.

Mapbox API を利用するには、アクセストークンを取得する必要があります。以下のリンクからログインし、API キーを取得してください。

[mapbox コンソール](https://console.mapbox.com/)

**ZENRIN Maps API**

１．検証用 ID とパスワード（PW）取得

ZENRIN Maps API を利用するには、検証用 ID とパスワード（PW）を取得し、API キーを取得する必要があります。以下のリンクから申請・取得を行ってください

[ZENRIN Maps API 　無料お試し ID 　お申込みフォーム](https://www.zenrin-datacom.net/solution/zenrin-maps-api/trial?fm_cp=6757baf3203e3a00bb118509&fm_mu=676391081fd14c0407cd2528&utm_campaign=6757baf3203e3a00bb118509&utm_medium=else&utm_source=Qiita3)

[ コンソール](https://test-console.zmaps-api.com/)

[リファレンス](https://developers.zmaps-api.com/v20/reference/)

### サンプルコード

---

**Mapbox**

### route_Mapbox.html:

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>最適巡回ルート比較</title>
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #map {
        width: 100%;
        height: 100vh;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>
    <script src="route_Mapbox.js"></script>
  </body>
</html>
```

### route_Mapbox.js:

```javascript
// Mapboxの初期化
mapboxgl.accessToken = "YOUR ACCESS TOKEN";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [139.6917, 35.6895], // 東京の座標
  zoom: 10,
});

const nav = new mapboxgl.NavigationControl();
// top-right'で右上に配置されます
map.addControl(nav, "top-right");

// 開始点、終了点、ウェイポイント
const startingPoint = [139.767132, 35.681406]; // 東京駅
const waypoint1 = [139.701636, 35.658034]; // 渋谷
const waypoint2 = [139.7054, 35.6893]; //  新宿高等学校
const endingPoint = [139.6917, 35.6895]; // 東京都庁舎

// マーカーを配置
[
  new mapboxgl.Marker({ color: "blue" }).setLngLat(startingPoint),
  new mapboxgl.Marker({ color: "green" }).setLngLat(waypoint1),
  new mapboxgl.Marker({ color: "yellow" }).setLngLat(waypoint2),
  new mapboxgl.Marker({ color: "red" }).setLngLat(endingPoint),
].forEach((marker) => marker.addTo(map));

// Optimized Trips APIを使用してルートを計算
async function calculateOptimizedRoute() {
  // 座標を「;」で連結してAPIに渡す
  const coordinates = [startingPoint, waypoint1, waypoint2, endingPoint]
    .map((coord) => coord.join(","))
    .join(";");
  // Optimized Trips APIのURL
  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}&source=first&destination=last&roundtrip=false`;

  try {
    // APIリクエストを送信
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    // ルート計算の成功を確認
    if (data.code !== "Ok") {
      throw new Error(`ルート計算エラー: ${data.message}`);
    }

    const route = data.trips[0].geometry;

    // 既存のルートを削除（必要に応じて）
    if (map.getLayer("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }

    // ルートを地図に表示
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: route,
      },
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 4,
      },
    });
  } catch (error) {
    console.error("ルート計算エラー:", error);
  }
}

// ページロード時にルートを計算
calculateOptimizedRoute();
```

### 解説

### Mapbox

**1. HTML 基本構造**

まず、Mapbox を使用するための基本的な HTML 構造を作成します。

この HTML ファイルには、Mapbox のライブラリを読み込み、#map の div 要素を用意しています。

**2. Mapbox の初期化**

Mapbox を初期化し、地図を表示します。

このコードで、東京を中心とした地図を表示し、ナビゲーションコントロールを追加します。

**3. ルート検索パラメータの設定**

開始点、終了点を設定します。

ここでは、東京駅から東京都庁舎までのルートを検索し、その点にマーカーを追加しています。

**4. ルート検索とマップへの描画**

このステップでは、Mapbox Optimized Trips API を使用して、  
設定したポイント間の最適なルートを計算し、地図に表示します

**① ルート検索のための API リクエストの作成**

API にリクエストを送信し、最適ルートを計算します。  
座標は , で結合し ; で区切ります。  
URL には Mapbox Optimized Trips API のエンドポイントと access_token を指定します。

source=first：開始点指定
destination=last：終点指定
roundtrip=false：出発点に戻らない

**② ルート検索**

fetch(url) を使用して API リクエストを非同期で送信し、レスポンスを取得して JSON 形式で解析します。  
data.code が "Ok" でない場合、エラーをスローします。  
エラーが発生した場合は、catch でエラーメッセージを表示します。

**③ マップへの描画**

既存のルートが表示されている場合は削除し、新しいルートデータを取得して GeoJSON 形式で地図に追加します。  
ルートは青色のラインとして描画されます。

**ZENRIN Maps API**

### route_zma.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>最適巡回ルート</title>
    <script src="https://test-js.zmaps-api.com/zma_loader.js?key=[APIキー]&auth=ip"></script>
    <script src="route_zma.js" type="text/javascript"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #ZMap {
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
      }
    </style>
  </head>

  <body>
    <div id="ZMap"></div>
  </body>
</html>
```

### route_zma.js:

```javascript
const start = { lat: 35.681406, lng: 139.767132 }; // 東京駅
const waypoint1 = { lat: 35.658034, lng: 139.701636 }; // 渋谷
const waypoint2 = { lat: 35.6893, lng: 139.7054 }; //  新宿高等学校
const destination = { lat: 35.6895, lng: 139.6917 }; // 東京都庁舎

ZMALoader.setOnLoad(function (mapOptions, error) {
  if (error) return console.error(error);

  mapOptions.center = new ZDC.LatLng(35.681406, 139.767132); // 中心点の緯度経度（東京駅）
  mapOptions.mouseWheelReverseZoom = true; //★マウスホイールのズーム方向の反転を指定
  mapOptions.zoom = 14;

  map = new ZDC.Map(
    document.getElementById("ZMap"),
    mapOptions,
    function () {
      // コントロールを追加
      map.addControl(new ZDC.ZoomButton("top-left"));
      map.addControl(new ZDC.ScaleBar("bottom-left"));

      // Add markers for start, waypoint, and destination
      map.addWidget(
        new ZDC.Marker(new ZDC.LatLng(start.lat, start.lng), {
          styleId: ZDC.MARKER_COLOR_ID_BLUE_L,
        })
      );
      map.addWidget(
        new ZDC.Marker(new ZDC.LatLng(destination.lat, destination.lng), {
          styleId: ZDC.MARKER_COLOR_ID_RED_L,
        })
      );
      map.addWidget(
        new ZDC.Marker(new ZDC.LatLng(waypoint1.lat, waypoint1.lng), {
          styleId: ZDC.MARKER_COLOR_ID_GREEN_L,
        })
      );
      map.addWidget(
        new ZDC.Marker(new ZDC.LatLng(waypoint2.lat, waypoint2.lng), {
          styleId: ZDC.MARKER_COLOR_ID_YELLOW_L,
        })
      ); // New waypoint

      // ウェイポイントを API リクエストの 1 つのパラメータに結合します
      const waypoints = `${waypoint1.lng},${waypoint1.lat},${waypoint2.lng},${waypoint2.lat}`;

      // Fetch optimal route with multiple waypoints
      fetch(
        `https://test-web.zmaps-api.com/route/route_mbn/drive_tsp?search_type=1&from=${start.lng},${start.lat}&to=${destination.lng},${destination.lat}&waypoint=${waypoints}`,
        {
          method: "GET",
          headers: {
            "x-api-key": "APIキー",
            Authorization: "ip",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK" && data.result?.item?.length > 0) {
            console.log(data);
            const decodedPath = data.result.item[0].route?.link?.flatMap(
              (link) =>
                link.line.coordinates.map(
                  (coord) => new ZDC.LatLng(coord[1], coord[0])
                )
            );
            if (decodedPath?.length) {
              map.addWidget(
                new ZDC.Polyline(decodedPath, {
                  color: "blue",
                  width: 4,
                  opacity: 1,
                })
              );
            } else {
              console.error("No decoded route data.");
            }
          } else {
            console.error("Failed to fetch route.", data);
          }
        })
        .catch(console.error);
    },
    function () {
      console.error("Failed to generate the map.");
    }
  );
});
```

### ZENRIN Maps API

**1. 地図の初期化**

ここでは、地図を初期化するための設定を行っています。  
ZMALoader.setOnLoad()で地図を初期化し、東京駅を中心にズームレベルと  
マウスホイールでのズームを反転させています。

**2. 地図コントロールの追加とマーカーの設定**

地図が読み込まれた後、ZDC.Map で地図を作成し、ズームボタンやスケールバーを追加します。

**3. ルート検索 API リクエスト**

fetch 関数を使って、出発地点と目的地の最適ルートを求める API リクエストを送信しています。  
API キーと認証情報をヘッダーに含めてリクエストします。

**4. ルートデータの処理とポリライン描画**

API から取得したルートデータを処理し、`ZDC.Polyline` を使って出発地から目的地までの経路を地図に描画します。  
経路のデータが正しく取得できた場合はポリラインが描画され、エラー時にはメッセージがコンソールに表示されます。

### 💡 コラム: オプショナルチェーン (`?.`) とは？

オプショナルチェーン (`?.`) を使うと、オブジェクトが `null` や `undefined` の場合でも安全にプロパティを参照できます。

#### ✅ メリット

- エラーを防ぎ、コードを短く書ける
- `if` 文で `undefined` チェックをする手間を省ける

?. は、オブジェクトが null や undefined でも安全にプロパティを参照できます。
エラーを防ぎ、コードを短く書けます。
もし ?. を使わないと、if 文で undefined チェックをする必要があります。

### Mapbox vs ZENRIN 地図 API 比較

**1. 地図の初期化**

`mapbox-gl.js` を使用し、指定した座標（例: 東京駅）を中心に地図を表示します。  
スタイルは `mapbox://styles/mapbox/streets-v11` で指定します。

ZMALoader を使用し、地図を初期化します。

ZDC.LatLng を使って中心座標を指定し、ズームレベルやマウスホイール操作の反転設定も行います。

**2. マーカーの追加**

Mapbox: mapboxgl.Marker でマーカーを追加します。色などのカスタマイズが可能です。

ZENRIN: ZDC.Marker を使用して、マーカーを追加します。マーカーの色も指定できます。

**3. ルート検索 API**

Mapbox: Optimized Trips API を使って、指定した出発点と目的地間の最適ルートを取得します。API リクエストは GeoJSON フォーマットでルートを取得します。

ZENRIN: Route API を使用して、出発点と目的地を指定し、最適な経路を取得します。ルート情報は JSON 形式で提供されます。

**4. 地図への描画**

Mapbox: API から取得したルートデータを GeoJSON フォーマットで地図に描画します。ラインのスタイルや色などのカスタマイズが可能です。

ZENRIN: 取得したルートデータを基に ZDC.Polyline でポリラインを描画します。経路のスタイルや色も指定可能です。

### 地図表示

**Mapbox**

![](image/mapbox.png)

**ZENRIN Maps API**

![](image/zdc.png)
