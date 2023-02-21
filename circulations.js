let nancyLatLng = new L.LatLng(48.697045, 6.189251) 
let nancyIutLatLng = new L.LatLng(48.682804, 6.161015)
let userLatLng;

//fetch data from API (get user ip to try to get his location)
async function asyncLocalisation() {
    const result = await fetch('https://ipapi.co/json/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { return data }
        )
        .catch(error => console.error(error));
    return result
}

//fetch data from API (get all incidents in Nancy)
async function asyncCirculations() {
    const result = await fetch('https://carto.g-ny.org/data/cifs/cifs_waze_v2.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { return data }
        )
        .catch(error => console.error(error));
    return result
}

document.addEventListener("DOMContentLoaded", function () {
    
    asyncLocalisation().then((result) => {
        //check if user is in Nancy (100km around), else set Nancy IUT as default
        userLatLng = new L.LatLng(result.latitude, result.longitude);
        let latPoint;
        let longPoint;
        if (userLatLng.distanceTo(nancyLatLng) < 100000) {
            latPoint = result.latitude;
            longPoint = result.longitude;
        } else {
            latPoint = nancyIutLatLng.lat;
            longPoint = nancyIutLatLng.lng;
        }

        //map + user marker location
        let map = L.map('map').setView([latPoint, longPoint], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            minZoom: 3,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        L.marker([latPoint, longPoint]).addTo(map).bindPopup("Vous êtes ici");
        
        //for each incident, add a marker on the map
        asyncCirculations().then((result) => {
            result.incidents.forEach(element => {
                let location = element.location.polyline
                let space = location.indexOf(" ")
                let latitude = location.substring(0, space);
                let longitude = location.substring(space + 1, location.length);
                L.marker([latitude, longitude]).addTo(map).bindPopup(
                    "<strong>"+ element.short_description + "</strong><br />" +
                    "<mark>" +element.type + "</mark><br />" +
                    "<i>"+ element.description + "<i/><br />" +
                    "-----------------------<br />" +
                    "date de début : " + element.starttime.substr(0,10) + "<br />" +
                    "date de fin : " + element.endtime.substr(0,10) + "<br />"
                );
            });
        })
    })
});