let map;
let markers = [];
let infoWindow;

function initMap() {
  let LosAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: LosAngeles,
    zoom: 8,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
  setOnClickListener();
}

function searchStores() {
  let foundStores = [];
  let zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    stores.forEach(function (store) {
      let postal = store.address.postalCode.substring(0, 5);
      if (postal === zipCode) {
        foundStores.push(store);
      }
    });
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener(foundStores);
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  let storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    //스크롤창에서 선택했을때 창 뜨도록
    elem.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function displayStores(stores) {
  let storesHtml = "";
  stores.forEach(function (store, index) {
    let address = store.addressLines;
    let phone = store.phoneNumber;
    storesHtml += `
    <div class="store-container">
            <div class="store-info-container">
                <div class="store-address">
                  <span>${address[0]}</span>
                   <span>${address[1]}</span>
                </div>
                <div class="store-phone">
                  ${phone}
                </div>
            </div>
            <div class="store-number-container">
              <div class="store-number">${index + 1}</div>
            </div>
          </div>`;
  });

  document.querySelector(".stores-list").innerHTML = storesHtml;
}
function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    let latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );

    let phone = store.phoneNumber;
    let closeTime = store.openStatusText;
    let name = store.name;
    let address = store.addressLines[0];
    bounds.extend(latlng);
    createMarker(latlng, name, address, closeTime, phone, index);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, closetime, phone, index) {
  let MarkerHtml = ` <div class="marker">
  <div class="name">${name}</div>
  <div class="closetime">${closetime}</div>
  <div class="address">
  <i class="fas fa-search-location"></i>${address}</div>
  <div class="phone">
  <i class="fas fa-mobile-alt"></i>${phone}</div>
</div>`;
  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index + 1}`,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    },
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(MarkerHtml);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
