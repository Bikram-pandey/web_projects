// Initialize ZDC Map variables
let map;
let marker;
let mrk_widget;

const ADDRESS_INPUT = document.getElementById("ADDRESS_INPUT");
const SUGGESTIONS_DIV = document.getElementById("SUGGESTIONS");
const BUILDING_NAME_DISPLAY = document.getElementById("BUILDING_NAME_DISPLAY");
const ADDRESS_DETAILS = document.getElementById("addressDetails");

const lat = 35.681406, lng = 139.767132;

// Initialize ZDC Map once it's loaded
ZMALoader.setOnLoad(function (mapOptions, error) {
    if (error) {
        console.error("Map Loader Error: ", error);
        return;
    }

    mapOptions.center = new ZDC.LatLng(lat, lng);
    mapOptions.mouseWheelReverseZoom = true;
    mapOptions.zipsMapType = "Ai3Y2Jwp";

    const mapElement = document.getElementById('ZMap');

    map = new ZDC.Map(
        mapElement,
        mapOptions,
        function () {
            map.addControl(new ZDC.ZoomButton('top-right'));
            map.addControl(new ZDC.ScaleBar('bottom-left'));
        },
        function () {
            // Failure callback
        }
    );
});

ADDRESS_INPUT.addEventListener("input", async () => {
    const QUERY = ADDRESS_INPUT.value.split(",")
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0)
        .join(",");

    if (QUERY.length < 2) {
        SUGGESTIONS_DIV.innerHTML = "";
        return;
    }

    let API_URL = `https://test-web.zmaps-api.com/data-coding/ac_premium?&word=${encodeURIComponent(QUERY)}&use_multi_addr=true&use_kana=true&use_pastmap=true&use_bluemap=true`;

    SUGGESTIONS_DIV.innerHTML = "<div class='AUTOCOMPLETE-SUGGESTION'>読み込み中...</div>";

    try {
        const RESPONSE = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'O8iPysCxWSagAdi6h70ub7I3DreHA5Qi7EEyUorM',
                'Authorization': 'referer',
            }
        });

        if (!RESPONSE.ok) throw new Error(`HTTP ERROR! STATUS: ${RESPONSE.status}`);

        const DATA = await RESPONSE.json();
        console.log(DATA);

        if (DATA.status === "OK" && DATA.result.info.hit > 0) {
            SHOW_SUGGESTIONS(DATA.result.item);
        } else {
            SUGGESTIONS_DIV.innerHTML = "<div class='AUTOCOMPLETE-SUGGESTION'>該当する住所がありません</div>";
        }
    } catch (ERROR) {
        console.error("エラー:", ERROR);
        SUGGESTIONS_DIV.innerHTML = "<div class='AUTOCOMPLETE-SUGGESTION'>エラーが発生しました</div>";
    }
});

function SHOW_SUGGESTIONS(ITEMS) {
    SUGGESTIONS_DIV.innerHTML = "";

    ITEMS.slice(0, 10).forEach(item => {
        const SUGGESTION = document.createElement("div");
        SUGGESTION.classList.add("AUTOCOMPLETE-SUGGESTION");

        const fullAddress = [item.address, item.address_detail2].filter(Boolean).join(" ");

        if (fullAddress.length <= 255) {
            SUGGESTION.textContent = fullAddress;
            SUGGESTION.addEventListener("click", () => FILL_ADDRESS(item));
            SUGGESTIONS_DIV.appendChild(SUGGESTION);
        }
    });
}

let buildingMarkers = []; // Array to hold building markers

function FILL_ADDRESS(ITEM) {
    document.getElementById("POSTAL_CODE").value = ITEM.post_code;
    document.getElementById("PREFECTURE").value = ITEM.address2;
    document.getElementById("CITY").value = ITEM.address3;
    document.getElementById("TOWN").value = ITEM.address4;
    ADDRESS_INPUT.value = ITEM.address;

    // Remove the current center marker and its widget
    if (marker) {
        map.removeControl(marker);
        map.removeWidget(mrk_widget);
        marker = null;  // Reset the marker to null
        mrk_widget = null;  // Reset the widget to null
    }


    // Remove any previous building markers
    if (buildingMarkers.length > 0) {
        buildingMarkers.forEach(buildingMarker => {
            map.removeWidget(buildingMarker);
        });
        buildingMarkers = []; // Clear the building markers array
    }

    // Check if match_position exists and add marker
    if (ITEM.match_position && ITEM.match_position.length === 2) {
        document.getElementById("LATLON").value = `${ITEM.match_position[1]},${ITEM.match_position[0]}`;
        const latLng = new ZDC.LatLng(ITEM.match_position[1], ITEM.match_position[0]);

        // Update the map with the new position
        map.setCenter(latLng);

        // Create and add marker
        marker = new ZDC.CenterMarker(latLng);
        mrk_widget = new ZDC.Marker(latLng);
        //map.addControl(marker);
        map.addWidget(mrk_widget);

    } else {
        document.getElementById("LATLON").value = "位置情報なし";
    }

    // Add markers for multiple buildings
    if (ITEM.building_info && Array.isArray(ITEM.building_info) && ITEM.building_info.length > 0) {
        ITEM.building_info.forEach((building, index) => {
            if (building.position && building.position.length === 2) {
                const buildingLatLng = new ZDC.LatLng(building.position[1], building.position[0]);

                // Create a base object for marker options
                let markerOptions = {
                    styleId: ZDC.MARKER_COLOR_ID_RED_S // Set color to red
                };

                // If there is more than one building, add contentStyleId
                if (ITEM.building_info.length > 1) {
                    // Dynamically generate the contentStyleId based on index
                    let contentStyleId = `MARKER_NUMBER_ID_${index + 1}_S`; // Generate the ID based on index (1, 2, 3,...)
                    markerOptions.contentStyleId = ZDC[contentStyleId]; // Pass the valid contentStyleId
                }

                // Create the marker with the dynamic options
                const buildingMarker = new ZDC.Marker(buildingLatLng, markerOptions);

                // Add marker to map
                map.addWidget(buildingMarker);

                // Store marker for further use if needed
                buildingMarkers.push(buildingMarker);
            }
        });
    }


    // Display building names if available
    if (ITEM.building_info && Array.isArray(ITEM.building_info) && ITEM.building_info.length > 0) {
        const buildingNames = ITEM.building_info.map(info => info.building_name).join(", ");
        BUILDING_NAME_DISPLAY.textContent = `建物名: ${buildingNames}`;
    } else {
        BUILDING_NAME_DISPLAY.textContent = '';  // Clear if no building names
    }

    SUGGESTIONS_DIV.innerHTML = ""; // Clear suggestions after selection
    // Show the additional information
    ADDRESS_DETAILS.style.display = "block";
}
