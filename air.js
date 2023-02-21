let date = document.getElementById("date");
let code = document.getElementById("code");
let qualite = document.getElementById("qualite");
//token create on aqicn.org (no qota limit, just 1000 request max per second)
const token = "85ee425818fa4b7890b960a25eb25b17e31a2988"
const city = "nancy"

//fetch data from API (get AQI(Air Quality Programmatic) in Nancy)
async function asyncAir() {
    const result = await fetch('https://api.waqi.info/feed/' + city + '/?token=' + token)
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
    
    //get AQI(Air Quality Programmatic) in Nancy (actualized everyday) and show some informations
    asyncAir().then((result) => {
        let qualiteMessage = "";
        if (result.data.aqi < 50) {
            qualiteMessage = "Bon";
        } else if (result.data.aqi < 100) {
            qualiteMessage = "Modéré";
        } else if (result.data.aqi < 150) {
            qualiteMessage = "Mauvais pour les personnes sensibles";
        } else if (result.data.aqi < 200) {
            qualiteMessage = "Mauvais";
        } else if (result.data.aqi < 300) {
            qualiteMessage = "Très mauvais";
        } else if (result.data.aqi > 300) {
            qualiteMessage = "Dangereux";
        }
        date.innerHTML = result.data.time.s;
        code.innerHTML = "<strong>" + result.data.aqi + "</strong>";
        qualite.innerHTML = "<strong>" + qualiteMessage + "</strong>";
    })

});