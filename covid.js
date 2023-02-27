function convertCSVToJSON(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }

        result.push(obj);
    }

    return result;
}



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

//fetch data from API (get all informations of Covid)
async function asyncCovid() {
    const result = fetch('https://www.data.gouv.fr/fr/datasets/r/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5')
        .then(response => response.text())
        .then(csvData => {
            return convertCSVToJSON(csvData);
        });
    return result

}


document.addEventListener("DOMContentLoaded", function () {
    asyncLocalisation().then((result) => {
        let dep = result.postal.substr(0, 2)
        document.getElementById('departement').innerHTML = dep
        asyncCovid().then((data) => {
            const covidData = data.filter((item) => item.dep === dep);
            let dateTab = []
            let hospTab = []
            let reaTab = []
            let decestab = []
            covidData.forEach(element => {
                dateTab.push(element.date)
                hospTab.push(element.hosp)
                reaTab.push(element.rea)
                decestab.push(element.dchosp)
            });
            const graph1 = document.getElementById('hosp').getContext('2d');
            new Chart(graph1, {
                type: 'line',
                // The data for our dataset
                data: {
                    labels: dateTab,
                    datasets: [{
                        label: 'Hospitalisations',
                        data: hospTab
                    },]
                },
                // Configuration options go here
                options: {
                }
            },);
            const graph2 = document.getElementById('rea').getContext('2d');
            new Chart(graph2, {
                type: 'line',
                // The data for our dataset
                data: {
                    labels: dateTab,
                    datasets: [{
                        label: 'Réanimations',
                        data: reaTab
                    },]
                },
                // Configuration options go here
                options: {
                }
            },);
            const graph3 = document.getElementById('deces').getContext('2d');
            new Chart(graph3, {
                type: 'line',
                // The data for our dataset
                data: {
                    labels: dateTab,
                    datasets: [{
                        label: 'Décès',
                        data: decestab
                    },]
                },
                // Configuration options go here
                options: {
                }
            },);
        });
    });
});
