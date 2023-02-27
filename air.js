let date = document.getElementById("date");
let code = document.getElementById("code");
let qualite = document.getElementById("qualite");

//fetch data from API (get AQI(Air Quality Programmatic) in Nancy)
async function asyncAir() {
    const result = await fetch('https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=')
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
    
    let currentTime = Date.now();
    let closestTime = 0;
    let smallestDiff = Number.MAX_VALUE;
    asyncAir().then((result) => {
        result.features.forEach(element => {
            let airQualityTime = element.attributes.date_ech;
            let diff = Math.abs(currentTime - airQualityTime);
            if (diff <= smallestDiff) {
                closestTime = airQualityTime;
                smallestDiff = diff;
            }
        });
        result.features.forEach(element => {
            if (element.attributes.date_ech === closestTime) {
                closestTime = Date(closestTime);
                let day = closestTime.substr(8, 2);
                let month = closestTime.substr(4, 3);
                let year = closestTime.substr(11, 4);
                date.innerHTML = day + " " + month + " " + year;
                code.innerHTML = element.attributes.code_qual;
                qualite.innerHTML = element.attributes.lib_qual;
            }
        });
    });
});