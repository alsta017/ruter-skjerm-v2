
// Definere variabler fra HTML
let fraForm = document.querySelector(".fra_form");
let tilForm = document.querySelector(".til_form");
let fraInput = document.getElementById("fra_input")
let tilInput = document.getElementById("til_input")
let fraVelg = document.getElementById("fra_velg");
let tilVelg = document.getElementById("til_velg");
let fratil = document.querySelector(".fratil");
let søkeButton = document.querySelector(".søkebutton")
let icon = document.querySelector(".icon");
let ekstra_valgEl = document.querySelector(".ekstra_valg")
let avgangbuttonEl = document.querySelector(".avgangbutton")
let ankomstbuttonEl = document.querySelector(".ankomstbutton")
let avgangbuttonidEl = document.getElementById("avgangbuttonid")
let ankomstbuttonidEl = document.getElementById("ankomstbuttonid")
let nowbuttonEl = document.querySelector(".nowbutton")
let datetimepickerEl = document.getElementById("datetimepicker")
let avansert_ekstra_valgEl = document.getElementById("avansert_ekstra_valg")
let avansert_ekstra_valg_buttonEl = document.getElementById("avansert_ekstra_valg_button")
let arrowEl = document.getElementById("arrow");
let byttetididEl = document.getElementById("byttetidid");
let byttetiddivEl = document.getElementById("byttetiddiv");
let resultaterEl = document.getElementById("resultater");
let detailsEl = document.getElementById("details");
let allTimeEl = document.getElementById("allTime");
let ekskludertelinjerdivEl = document.getElementById("ekskludertelinjerdiv");
let trip;
const redSpecialLines = ["110", "100", "300", "300E", "130", "140", "145", "500X", "1B", "2B", "3B", "4B", "5B", "11B", "12B", "13B", "17B", "18B", "19B", "31E", "80E", "84E", "56B", "73X", "75A", "75B", "75C", "77X", "77B", "77C", "78A", "78B", "80X", "81X", "1N", "2N", "3N", "4N", "5N", "11N", "12N", "19N", "42N", "63N", "70N", "81N", "130N", "140N", "70E"];
const greenSpecialLines = ["110E", "115E", "125E", "140E", "150E", "160E", "250E", "255E", "260E", "265E", "390E", "400E", "470E", "210A", "210B", "215A", "215B", "370A", "370B", "505E", "545A", "545B", "560N", "565E", "240N", "250N", "500N", "540N"];

// Definere generelle variabler som skal bruke senere
let velgArr = [];
let stedArr = [];
let velgArr2 = [];
let stedArr2 = [];
let searchTimeout;
let searchTimeout2;
let fraclickedid;
let tilclickedid;
let geocoder_til_data;
let geocoder_fra_data;
let geocoder_til_check;
let geocoder_fra_check;

// Ikke vise date time picker on start
datetimepickerEl.style.display = "none";

// Skjekk om dark mode er på eller av (LocalStorage)
if (localStorage.getItem("light_mode") == "true") {
    darkmodecheck()
} else {
    localStorage.setItem("light_mode", "false");
}

// Når man skriver noe i FraInput
fraInput.onkeydown = function() {

    // Nullstille alt
    velgArr = [];
    fraVelg.textContent = "";

    // Vise fraVelg
    fraVelg.style.display = "flex";

    // Lage laster P element
    let tilload = document.createElement("p");
    tilload.textContent = "...";
    fraVelg.appendChild(tilload);

    // Lage searchTimeout på 0.5 sekunder så den ikke sender requests hele tiden (timeout)
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fra_geocoder_fra, 500);
};

function fra_geocoder_fra() {

    // Api request geocoder api (for å finne stedsnavn / coords)
    fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${fraInput.value}`, {
            headers: { 
                "ET-Client-Name": "alsta017-reiseplanlegger",
            },
        })
        .then(response => response.json())
        .then(data => {

            // Definere arrays or resette
            stedArr = [];
            velgArr = [];
            fraVelg.textContent = "";
            a = 0;

            console.log(data)

            geocoder_fra_data = data;

            // For alle resultater av stedsnavn i data, legg til i stedArr og vise i fraVelg
            for(x = 0; x < data.features.length; x++) {
                a++;

                // Ny div for hver stedsnavn
                let stasjonsP = document.createElement("p");
                stasjonsP.className = "stasjonsP";
                stasjonsP.setAttribute("id", `${a}`)
                stasjonsP.setAttribute("onclick", "buttonclicked(this.id)");
                stasjonsP.innerHTML = data.features[x].properties.label;

                // Definere ikoner
                let icon;
                let icon2;
                let icon3;
                let icon4;
                let icon5;
                let icon6;
                let icon7;
                let icon8;

                // Legge til ikoner basert på feature
                for (y = 0; y < data.features[x].properties.category.length; y++) {
                    if(data.features[x].properties.category[y] === "onstreetBus" | data.features[x].properties.category[y] === "busStation" | data.features[x].properties.category[y] === "coachStation") {
                        if (!icon) {
                            icon = document.createElement("i");
                            icon.className = "fa-solid fa-bus icon bus";
                            stasjonsP.appendChild(icon);
                        }
                    } else if(data.features[x].properties.category[y] === "metroStation") {
                        if (!icon2) {
                            icon2 = document.createElement("i");
                            icon2.className = "fa-solid fa-train-subway icon metro";
                            stasjonsP.appendChild(icon2)
                        }
                    } else if(data.features[x].properties.category[y] === "onstreetTram" | data.features[x].properties.category[y] === "tramStation") {
                        if (!icon3) {
                            icon3 = document.createElement("i");
                            icon3.className = "fa-solid fa-train-tram icon tram";
                            stasjonsP.appendChild(icon3)
                        }
                    } else if(data.features[x].properties.category[y] === "railStation") {
                        if (!icon4) {
                            icon4 = document.createElement("i");
                            icon4.className = "fa-solid fa-train icon train";
                            stasjonsP.appendChild(icon4)
                        }
                    } else if(data.features[x].properties.category[y] === "ferryStop" | data.features[x].properties.category[y] === "harbourPort" | data.features[x].properties.category[y] === "ferryPort" | data.features[x].properties.category[y] === "ferryStop") {
                        if (!icon5) {
                            icon5 = document.createElement("i");
                            icon5.className = "fa-solid fa-ferry icon ferry";
                            stasjonsP.appendChild(icon5)
                        }
                    } else if(data.features[x].properties.category[y] === "airport") {
                        if (!icon6) {
                            icon6 = document.createElement("i");
                            icon6.className = "fa-solid fa-plane-departure icon airport";
                            stasjonsP.appendChild(icon6)
                        }
                    } else if(data.features[x].properties.category[y] === "liftStation") {
                        if (!icon8) {
                            icon8 = document.createElement("i");
                            icon8.className = "fa-solid fa-cable-car icon lift";
                            stasjonsP.appendChild(icon8)
                        }
                    } else {
                        if (!icon7) {
                            icon7 = document.createElement("i");
                            icon7.className = "fa-solid fa-location-dot icon point";
                            stasjonsP.appendChild(icon7)
                        }
                    }
                }

                // Definere id og navn for hver stedsnavn
                var fraId = data.features[x].properties.id;
                var stasjonsnavn = data.features[x].properties.label;
                

                // Legge til i html (append)
                fraVelg.appendChild(stasjonsP);
                velgArr.push(fraId);
                stedArr.push(stasjonsnavn);
            }

            // hvis ingen resultater
            if(velgArr.length === 0) {
                // Lage ny p element
                let tilnoresult = document.createElement("p")
                if(fraInput.value.length == 0) {
                    // Fjerne element fra html
                    fraVelg.removeChild(tilnoresult);
                } else {
                    // Legge til ingen resultater tekst
                    tilnoresult.textContent = "Ingen resultater."
                }
                // Legge til i html (append)
                fraVelg.appendChild(tilnoresult)
            }
        }) 
}

// Når knappen på stedsnavn trykket
function buttonclicked(clicked_id) {
    // Hide fraVelg
    fraVelg.style.display = "none";

    // Putte samme id i button som i stedArr
    fraInput.value = stedArr[clicked_id - 1];

    localStorage.setItem('lastFrom', fraInput.value);

    // Tømme stedArr
    stedArr = [];

    // Definere fraVelgClickedId som er iden til knappen som blir trykket
    fraclickedid = clicked_id - 1;

    localStorage.setItem('fraclickedid', fraclickedid);

    const selectedLocation = geocoder_fra_data.features;
    localStorage.setItem('lastFromLocation', JSON.stringify(selectedLocation));

}

// Skjekk fraInput for kommentarer
tilInput.onkeydown = function() {
    velgArr2 = [];
    tilVelg.textContent = "";
    tilVelg.style.display = "flex";

    let tilload2 = document.createElement("p");
    tilload2.textContent = "...";
    tilVelg.appendChild(tilload2);

    if (searchTimeout2 != undefined) clearTimeout(searchTimeout2);
    searchTimeout2 = setTimeout(fra_geocoder_til, 500);
};

// Skjekk fra_geocoder_fra for kommentarer
function fra_geocoder_til() {
    fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${tilInput.value}`, {
            headers: {
                "ET-Client-Name": "alsta017-reiseplanlegger",
            },
        })
        .then(response => response.json())
        .then(data => {
            stedArr2 = [];
            velgArr2 = [];
            tilVelg.textContent = "";
            a = 0;
            console.log(data);
            geocoder_til_data = data;
            for(x = 0; x < data.features.length; x++) {
                a++;
                let stasjonsP = document.createElement("p");
                stasjonsP.className = "stasjonsP";
                stasjonsP.setAttribute("id", `${a}`)
                stasjonsP.setAttribute("onclick", "buttonclickedtil(this.id)");
                stasjonsP.innerHTML = data.features[x].properties.label;
                let icon;
                let icon2;
                let icon3;
                let icon4;
                let icon5;
                let icon6;
                let icon7;
                let icon8;
                for (y = 0; y < data.features[x].properties.category.length; y++) {
                    if(data.features[x].properties.category[y] === "onstreetBus" | data.features[x].properties.category[y] === "busStation" | data.features[x].properties.category[y] === "coachStation") {
                        if (!icon) {
                            icon = document.createElement("i");
                            icon.className = "fa-solid fa-bus icon bus";
                            stasjonsP.appendChild(icon);
                        }
                    } else if(data.features[x].properties.category[y] === "metroStation") {
                        if (!icon2) {
                            icon2 = document.createElement("i");
                            icon2.className = "fa-solid fa-train-subway icon metro";
                            stasjonsP.appendChild(icon2)
                        }
                    } else if(data.features[x].properties.category[y] === "onstreetTram" | data.features[x].properties.category[y] === "tramStation") {
                        if (!icon3) {
                            icon3 = document.createElement("i");
                            icon3.className = "fa-solid fa-train-tram icon tram";
                            stasjonsP.appendChild(icon3)
                        }
                    } else if(data.features[x].properties.category[y] === "railStation") {
                        if (!icon4) {
                            icon4 = document.createElement("i");
                            icon4.className = "fa-solid fa-train icon train";
                            stasjonsP.appendChild(icon4)
                        }
                    } else if(data.features[x].properties.category[y] === "ferryStop" | data.features[x].properties.category[y] === "harbourPort" | data.features[x].properties.category[y] === "ferryPort" | data.features[x].properties.category[y] === "ferryStop") {
                        if (!icon5) {
                            icon5 = document.createElement("i");
                            icon5.className = "fa-solid fa-ferry icon ferry";
                            stasjonsP.appendChild(icon5)
                        }
                    } else if(data.features[x].properties.category[y] === "airport") {
                        if (!icon6) {
                            icon6 = document.createElement("i");
                            icon6.className = "fa-solid fa-plane-departure icon airport";
                            stasjonsP.appendChild(icon6)
                        }
                    } else if(data.features[x].properties.category[y] === "liftStation") {
                        if (!icon8) {
                            icon8 = document.createElement("i");
                            icon8.className = "fa-solid fa-cable-car icon lift";
                            stasjonsP.appendChild(icon8)
                        }
                    } else {
                        if (!icon7) {
                            icon7 = document.createElement("i");
                            icon7.className = "fa-solid fa-location-dot icon point";
                            stasjonsP.appendChild(icon7)
                        }
                    }
                }
                var tilId = data.features[x].properties.id;
                var stasjonsnavntil = data.features[x].properties.label;
                tilVelg.appendChild(stasjonsP);
                velgArr2.push(tilId);
                stedArr2.push(stasjonsnavntil);
            }
            if(velgArr2.length === 0) {
                let tilnoresult = document.createElement("p")
                if(tilInput.value.length == 0) {
                    tilVelg.removeChild(tilnoresult);
                } else {
                    tilnoresult.textContent = "Ingen resultater."
                }
                tilVelg.appendChild(tilnoresult)
            }
        }) 
}

// Skjekk buttonclicked for kommentarer
function buttonclickedtil(clicked_id) {
    tilVelg.style.display = "none";
    tilInput.value = stedArr2[clicked_id - 1];
    localStorage.setItem('lastTo', tilInput.value);
    stedArr2 = [];
    tilclickedid = clicked_id - 1;
    const selectedLocation = geocoder_til_data.features;
    localStorage.setItem('lastFromLocation', JSON.stringify(selectedLocation));
}

function søkreise() {


    if(fraInput.value.length == 0 || tilInput.value.length == 0) {
        alert("Vennligst fyll ut fra/til feltene")
    } else {

        resultaterEl.textContent = "";

        let søkerEl = document.createElement("p");
        søkerEl.textContent = "Søker etter reiseforslag..."
        resultaterEl.appendChild(søkerEl);

        let fraValue;
        let toValue;


        if (geocoder_fra_data.features[fraclickedid]) {
            let fraFeature = geocoder_fra_data.features[fraclickedid];
            if (fraFeature.properties.layer === "address") {
                fraValue = `{coordinates: {latitude: ${fraFeature.geometry.coordinates[1]}, longitude: ${fraFeature.geometry.coordinates[0]}}, name: "${fraFeature.properties.name}"}`
            } else if (fraFeature.properties.layer === "venue") {
                fraValue = `{place: "${fraFeature.properties.id}"}`
            } else {
                fraValue = `{coordinates: {latitude: ${fraFeature.geometry.coordinates[1]}, longitude: ${fraFeature.geometry.coordinates[0]}}}`
            }
        } else {
            console.error(`Invalid fraclickedid: ${fraclickedid}`);
        }
        
        if (geocoder_til_data.features[tilclickedid]) {
            let tilFeature = geocoder_til_data.features[tilclickedid];
            if (tilFeature.properties.layer === "address") {
                toValue = `{coordinates: {latitude: ${tilFeature.geometry.coordinates[1]}, longitude: ${tilFeature.geometry.coordinates[0]}}, name: "${tilFeature.properties.name}"}`
            } else if (tilFeature.properties.layer === "venue") {
                toValue = `{place: "${tilFeature.properties.id}"}`
            } else {
                toValue = `{coordinates: {latitude: ${tilFeature.geometry.coordinates[1]}, longitude: ${tilFeature.geometry.coordinates[0]}}}`
            }
        } else {
            console.error(`Invalid tilclickedid: ${tilclickedid}`);
        }

        let timeEl;
        let avgangAnkomst;
        if (avgangbuttonidEl.classList.contains("selected")) {
            timeEl = new Date(datetimepickerEl.value).toISOString();
            avgangAnkomst = false;
        } else if (ankomstbuttonidEl.classList.contains("selected")) {
            timeEl = new Date(datetimepickerEl.value).toISOString();
            avgangAnkomst = true;
        } else {
            timeEl = new Date().toISOString();
            avgangAnkomst = false;
        }

        const lastFromLocation = JSON.parse(localStorage.getItem('lastFromLocation'));
        const lastToLocation = JSON.parse(localStorage.getItem('lastToLocation'));

        // Now use lastFromLocation and lastToLocation instead of geocoder_fra_data.features[fraclickedid] and geocoder_til_data.features[tilclickedid]

        let byttetididElSec = byttetididEl.value * 60;

        fetch('https://api.entur.io/journey-planner/v3/graphql', {
        method: 'POST',
        headers: {
        // Replace this with your own client name:
        'ET-Client-Name': 'alsta017-reiseplanlegger',
        'Content-Type': 'application/json'
        },
        // GraphQL Query
        // https://api.entur.io/graphql-explorer/journey-planner-v3?query=%7B%0A%20%20trip%28%0A%20%20%20%20from%3A%20%7Bplace%3A%20"NSR%3AStopPlace%3A58227"%7D%0A%20%20%20%20to%3A%20%7Bplace%3A%20"NSR%3AStopPlace%3A5920"%7D%0A%20%20%20%20dateTime%3A%20"2024-05-27T16%3A00%3A00.000Z"%0A%20%20%20%20walkSpeed%3A%201.3%0A%20%20%20%20arriveBy%3A%20false%0A%20%20%20%20includePlannedCancellations%3A%20true%0A%20%20%20%20includeRealtimeCancellations%3A%20true%0A%20%20%20%20transferSlack%3A%205%0A%20%20%29%20%7B%0A%20%20%20%20fromPlace%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20toPlace%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20tripPatterns%20%7B%0A%20%20%20%20%20%20aimedStartTime%0A%20%20%20%20%20%20expectedStartTime%0A%20%20%20%20%20%20aimedEndTime%0A%20%20%20%20%20%20expectedEndTime%0A%20%20%20%20%20%20streetDistance%0A%20%20%20%20%20%20walkTime%0A%20%20%20%20%20%20duration%0A%20%20%20%20%20%20legs%20%7B%0A%20%20%20%20%20%20%20%20aimedStartTime%0A%20%20%20%20%20%20%20%20expectedStartTime%0A%20%20%20%20%20%20%20%20aimedEndTime%0A%20%20%20%20%20%20%20%20expectedEndTime%0A%20%20%20%20%20%20%20%20mode%0A%20%20%20%20%20%20%20%20duration%0A%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20fromEstimatedCall%20%7B%0A%20%20%20%20%20%20%20%20%20%20destinationDisplay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20frontText%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20cancellation%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20fromPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20toPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20intermediateEstimatedCalls%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20aimedArrivalTime%0A%20%20%20%20%20%20%20%20%20%20expectedArrivalTime%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=
        body: JSON.stringify({ 
            query: `{
                trip(
                    from: ${fraValue}
                    to: ${toValue}
                    dateTime: "${timeEl}"
                    arriveBy: ${avgangAnkomst}
                    walkSpeed: 1.3
                    includePlannedCancellations: true
                    includeRealtimeCancellations: true
                    transferSlack: ${byttetididElSec}
                ) {
                    fromPlace {
                        name
                    }
                    toPlace {
                        name
                    }
                    tripPatterns {
                        aimedStartTime
                        expectedStartTime
                        aimedEndTime
                        expectedEndTime
                        streetDistance
                        walkTime
                        duration
                        legs {
                            aimedStartTime
                            expectedStartTime
                            aimedEndTime
                            expectedEndTime
                            mode
                            duration
                            line {
                                publicCode
                            }
                            fromEstimatedCall {
                                destinationDisplay {
                                    frontText
                                }
                                cancellation
                            }
                            fromPlace {
                                quay {
                                    name
                                    latitude
                                    longitude
                                }
                                latitude
                                longitude
                                name
                            }
                            toPlace {
                                quay {
                                    name
                                    latitude
                                    longitude
                                }
                                latitude
                                longitude
                                name
                            }
                            pointsOnLink {
                                points
                            }
                            intermediateEstimatedCalls {
                                quay {
                                    name
                                    latitude
                                    longitude
                                }
                                aimedArrivalTime
                                expectedArrivalTime
                            }
                            authority {
                                name
                            }
                        }
                    }
                }
            }`
        }),
        })
        .then(res => res.json())
        .then(stopPlaceData => {
            resultaterEl.textContent = "";
            console.log(stopPlaceData);
            let html = '';
            trip = stopPlaceData.data.trip;
            for (let i = 0; i < trip.tripPatterns.length; i++) {

                const thisTrip = trip.tripPatterns[i];

                const thisDepartureDiv = document.createElement('div');
                thisDepartureDiv.className = "thisDepartureDiv";
                thisDepartureDiv.setAttribute("id", i);
                thisDepartureDiv.setAttribute("onclick", "departureclick(this.id)");
                
                const time = document.createElement("div");
                time.className = "allTime";

                const aimedStartTime = document.createElement("div");
                const expectedStartTime = document.createElement("div");
                aimedStartTime.className = "aimedStartTime";
                expectedStartTime.className = "expectedStartTime";
                aimedStartTime.textContent = new Date(thisTrip.aimedStartTime).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'});
                expectedStartTime.textContent = new Date(thisTrip.expectedStartTime).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'});

                if (aimedStartTime.textContent !== expectedStartTime.textContent) {
                    aimedStartTime.textContent = " (" + aimedStartTime.textContent + ")";
                    aimedStartTime.classList = "aimedStartTime smaller";
                    time.appendChild(expectedStartTime);
                    time.appendChild(aimedStartTime);
                } else {
                    time.appendChild(aimedStartTime);
                };

                const separatorLine = document.createElement("div");
                separatorLine.className = "separatorLine";
                separatorLine.textContent = "-";

                time.appendChild(separatorLine)

                const aimedEndTime = document.createElement("div");
                const expectedEndTime = document.createElement("div");
                aimedEndTime.className = "aimedEndTime";
                expectedEndTime.className = "expectedEndTime";
                aimedEndTime.textContent = new Date(thisTrip.aimedEndTime).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'});
                expectedEndTime.textContent = new Date(thisTrip.expectedEndTime).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'});
                if (aimedEndTime.textContent !== expectedEndTime.textContent) {
                    aimedEndTime.textContent = " (" + aimedEndTime.textContent + ")";
                    aimedEndTime.classList = "aimedEndTime smaller";
                    time.appendChild(expectedEndTime);
                    time.appendChild(aimedEndTime);
                } else {
                    time.appendChild(aimedEndTime);
                };
                
                thisDepartureDiv.appendChild(time)

                const lines = document.createElement("div");
                lines.className = "linesDiv";
                
                for(let j = 0; j < thisTrip.legs.length; j++) {
                    const line = document.createElement("div");
                    line.className = "line";
                    if (thisTrip.legs[j].line) {
                        if (thisTrip.legs[j].authority) {
                            if (thisTrip.legs[j].authority.name === "Ruter") {
                                if (thisTrip.legs[j].mode === "bus" || thisTrip.legs[j].mode === "tram" || thisTrip.legs[j].mode === "metro") {
                                    line.textContent = thisTrip.legs[j].line.publicCode;
    
                                    const thisPubliCode = thisTrip.legs[j].line.publicCode;
                
                                    if (thisPubliCode > 0 && thisPubliCode < 10) {
                                        line.className = "line orange";
                                    } else if (thisPubliCode > 9 && thisPubliCode < 20) {
                                        line.className = "line blue";
                                    } else if (thisPubliCode > 19 && thisPubliCode < 99 || redSpecialLines.includes(thisPubliCode)) {
                                        line.className = "line red";
                                    } else if (thisPubliCode > 100 && thisPubliCode < 4000 || greenSpecialLines.includes(thisPubliCode)) {
                                        line.className = "line green";
                                    } else {
                                        line.className = "line gray";
                                    }
                                } else if (thisTrip.legs[j].mode === "water") {
                                    line.className = "line boat";
                                    line.textContent = thisTrip.legs[j].line.publicCode;
                                } else if (thisTrip.legs[j].line.publicCode) {
                                    line.className = "line gray";
                                    line.textContent = thisTrip.legs[j].line.publicCode;
                                }
                            } else if (thisTrip.legs[j].authority.name === "Vy" || thisTrip.legs[j].authority.name === "NSB" || thisTrip.legs[j].authority.name === "GJB") {
                                line.className = "line train";
                                line.textContent = thisTrip.legs[j].line.publicCode;
                            } else {
                                if (thisTrip.legs[j].line) {
                                    line.textContent = thisTrip.legs[j].line.publicCode;
                                    line.className = "line gray"
                                }
                            }
                        } else {
                            if (thisTrip.legs[j].line) {
                                line.textContent = thisTrip.legs[j].line.publicCode;
                                line.className = "line gray"
                            }
                        }
                    } else {
                        let ielement = document.createElement("i");
                        line.className = "line gray";
                        if (thisTrip.legs[j].mode === "air") {
                            ielement.className = "fa-solid fa-plane";
                        } else if (thisTrip.legs[j].mode === "bicycle") {
                            ielement.className = "fa-solid fa-bicycle";
                        } else if (thisTrip.legs[j].mode === "bus") {
                            ielement.className = "fa-solid fa-bus";
                        } else if (thisTrip.legs[j].mode === "cableway") {
                            ielement.className = "fa-solid fa-cable-car";
                        } else if (thisTrip.legs[j].mode === "water") {
                            ielement.className = "fa-solid fa-ferry";
                        } else if (thisTrip.legs[j].mode === "funicular") {
                            ielement.className = "fa-solid fa-subway";
                        } else if (thisTrip.legs[j].mode === "lift") {
                            ielement.className = "fa-solid fa-elevator";
                        } else if (thisTrip.legs[j].mode === "rail") {
                            ielement.className = "fa-solid fa-train";
                        } else if (thisTrip.legs[j].mode === "metro") {
                            ielement.className = "fa-solid fa-train-subway";
                        } else if (thisTrip.legs[j].mode === "taxi") {
                            ielement.className = "fa-solid fa-taxi";
                        } else if (thisTrip.legs[j].mode === "tram") {
                            ielement.className = "fa-solid fa-train-tram";
                        } else if (thisTrip.legs[j].mode === "trolleybus") {
                            ielement.classList = "fa-solid fa-bus"
                        } else if (thisTrip.legs[j].mode === "monorail") {
                            ielement.className = "fa-solid fa-train-subway";
                        } else if (thisTrip.legs[j].mode === "coach") {
                            ielement.className = "fa-solid fa-bus";
                        } else if (thisTrip.legs[j].mode === "foot") {
                            ielement.className = "fa-solid fa-person-walking";
                        } else if (thisTrip.legs[j].mode === "car") {
                            ielement.className = "fa-solid fa-car";
                        } else if (thisTrip.legs[j].mode === "scooter") {
                            ielement.className = "fa-solid fa-bicycle";
                        } else {
                            ielement.className = "fa-solid fa-question";
                        }
                        line.appendChild(ielement);
                    } // HUSK Å FORSTETET ELLER NOE SÅNT
                lines.appendChild(line);
                }
            thisDepartureDiv.appendChild(time)
            thisDepartureDiv.appendChild(lines)
            resultaterEl.appendChild(thisDepartureDiv)
            }
        }
    )};
}

var map;

function departureclick(id) {
    document.getElementById('overlay').style.display = 'flex';

    // Initialize the map centered on a specific location with a given zoom level
    map = L.map('map').setView([59.91, 10.75], 13);

    // Replace the Mapbox tile layer with the OpenStreetMap tile layer
    L.tileLayer('https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=B38UkAr4o4dNX87Kc0VF', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="https://maptiler.com/">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright">',
        maxZoom: 19
    }).addTo(map);

    detailsEl.textContent = "";

    let reiseoversikth1 = document.createElement("h1");
    reiseoversikth1.textContent = "Fra " + trip.fromPlace.name + " til " + trip.toPlace.name;
    reiseoversikth1.className = "Reiseoversikt_h1"
    detailsEl.appendChild(reiseoversikth1);

    // Iterate through the trip patterns and add polylines and markers to the map
    for (let p = 0; p < trip.tripPatterns[id].legs.length; p++) {
        let encodedPolyLine = trip.tripPatterns[id].legs[p].pointsOnLink.points;
        let decodedPolyLine = L.PolylineUtil.decode(encodedPolyLine);
        
        let polylineColor;
        if (trip.tripPatterns[id].legs[p].authority) {
            if (trip.tripPatterns[id].legs[p].authority.name === "Ruter") {
                let thisTripCode = trip.tripPatterns[id].legs[p].line.publicCode;

                if (thisTripCode > 0 && thisTripCode < 10) {
                    polylineColor = "#EC700C";
                } else if (thisTripCode > 9 && thisTripCode < 20) {
                    polylineColor = "#0B91EF";
                } else if (thisTripCode > 19 && thisTripCode < 99 || redSpecialLines.includes(thisTripCode)) {
                    polylineColor = "#E60000";
                } else if (thisTripCode > 100 && thisTripCode < 4000 || greenSpecialLines.includes(thisTripCode)) {
                    polylineColor = "#76A300";
                } else {
                    polylineColor = "#828282";
                }
            } else {
                polylineColor = "#828282";
            }
        } else {
            polylineColor = "#828282";
        };

        let polyLine = L.polyline(decodedPolyLine, { color: polylineColor, weight: 6 });
        polyLine.addTo(map);

        let PlaceIcon = L.divIcon({
            className: 'place-icon',
            html: `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="7.5" fill="white" stroke="${polylineColor}" stroke-width="3"/></svg>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });        

        if (trip.tripPatterns[id].legs[p].fromPlace.quay) {
        L.marker([trip.tripPatterns[id].legs[p].fromPlace.latitude, trip.tripPatterns[id].legs[p].fromPlace.longitude], { icon: PlaceIcon }).addTo(map)
            .bindPopup(trip.tripPatterns[id].legs[p].fromPlace.quay.name)
            .openPopup();
        } else {
            L.marker([trip.tripPatterns[id].legs[p].fromPlace.latitude, trip.tripPatterns[id].legs[p].fromPlace.longitude], { icon: PlaceIcon }).addTo(map)
            .bindPopup(trip.tripPatterns[id].legs[p].fromPlace.name)
            .openPopup();
        }

        if (trip.tripPatterns[id].legs[p].toPlace.quay) {
            L.marker([trip.tripPatterns[id].legs[p].toPlace.latitude, trip.tripPatterns[id].legs[p].toPlace.longitude], { icon: PlaceIcon }).addTo(map)
            .bindPopup(trip.tripPatterns[id].legs[p].toPlace.quay.name)
            .openPopup();
        } else {
            L.marker([trip.tripPatterns[id].legs[p].toPlace.latitude, trip.tripPatterns[id].legs[p].toPlace.longitude], { icon: PlaceIcon }).addTo(map)
            .bindPopup(trip.tripPatterns[id].legs[p].toPlace.name)
            .openPopup();
        }

        function getPolylineMidpoint(latlngs) {
        
            // Check if the array is empty
            if (latlngs.length === 0) {
                console.error('The array of coordinates is empty.');
                return null;
            }
        
            let totalDistance = 0;
            let cumulativeDistances = [];
        
            // Calculate cumulative distances between points
            for (let i = 0; i < latlngs.length - 1; i++) {
                const latlng1 = latlngs[i];
                const latlng2 = latlngs[i + 1];
                const distance = calculateDistance(latlng1, latlng2);
                totalDistance += distance;
                cumulativeDistances.push(totalDistance);
            }
        
            // Halfway distance
            const halfDistance = totalDistance / 2;
        
            // Find the segment where the half distance falls
            for (let i = 0; i < cumulativeDistances.length; i++) {
                if (cumulativeDistances[i] >= halfDistance) {
                    const latlng1 = latlngs[i];
                    const latlng2 = latlngs[i + 1];
                    const segmentDistance = cumulativeDistances[i] - (cumulativeDistances[i - 1] || 0);
                    const remainingDistance = halfDistance - (cumulativeDistances[i - 1] || 0);
                    const ratio = remainingDistance / segmentDistance;
        
                    const midpointLat = latlng1[0] + (latlng2[0] - latlng1[0]) * ratio;
                    const midpointLng = latlng1[1] + (latlng2[1] - latlng1[1]) * ratio;
        
                    const midpoint = { lat: midpointLat, lng: midpointLng };
                    return midpoint;
                }
            }
        
            console.error('Could not determine the midpoint.');
            return null;
        }
        
        function calculateDistance(latlng1, latlng2) {
            const R = 6371e3; // Earth radius in meters
            const lat1 = latlng1[0] * Math.PI / 180;
            const lat2 = latlng2[0] * Math.PI / 180;
            const deltaLat = (latlng2[0] - latlng1[0]) * Math.PI / 180;
            const deltaLng = (latlng2[1] - latlng1[1]) * Math.PI / 180;
        
            const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                      Math.cos(lat1) * Math.cos(lat2) *
                      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
            const distance = R * c;
            return distance;
        }
        
        let midpoint = getPolylineMidpoint(decodedPolyLine);
        let thisDeparture = trip.tripPatterns[id].legs[p];
        
        if (midpoint && thisDeparture.line !== null) {  // Ensure midpoint is valid and thisDeparture.line is not null
            const publicCode = thisDeparture.line.publicCode;
            let right = '0px';
            let left = '0px';
        
            // Adjust font size and padding based on the length of the public code
            if (publicCode.length === 1) {
                left = '5px';
            }

            if (publicCode.endsWith('E') || publicCode.endsWith('X')) {
                right = `${parseInt(right) + 2}px`;
            }
        
            let midpointIcon = L.divIcon({
                className: 'midpoint-icon',
                html: `<div class="icon-box" style="background-color: ${polylineColor}; margin-left: ${right}; margin-right: ${left};">
                            <span class="icon-number">${publicCode}</span>
                        </div>`,
                iconSize: [20, 20],  // Adjust the size as needed
                iconAnchor: [10, 10],  // Center the icon
                popupAnchor: [0, -15]
            });
            L.marker(midpoint, { icon: midpointIcon }).addTo(map);
        } else {
            if (midpoint === null) {
                console.error('Midpoint is invalid.');
            }
            if (thisDeparture.line === null) {
                // Do nothing
            }
        }

        let intermediateIcon = L.divIcon({
            className: 'intermediate-icon',
            html: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="5" fill="white" stroke="${polylineColor}" stroke-width="2"/></svg>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            popupAnchor: [0, -20]
        });        

        if (trip.tripPatterns[id].legs[p].intermediateEstimatedCalls) {
            for (let l = 0; l < trip.tripPatterns[id].legs[p].intermediateEstimatedCalls.length; l++) {
                let marker = L.marker([trip.tripPatterns[id].legs[p].intermediateEstimatedCalls[l].quay.latitude, trip.tripPatterns[id].legs[p].intermediateEstimatedCalls[l].quay.longitude], { icon: intermediateIcon }).addTo(map);
                marker.bindTooltip(trip.tripPatterns[id].legs[p].intermediateEstimatedCalls[l].quay.name, {
                    permanent: true,
                    direction: 'bottom',
                    className: 'intermediate-tooltip'
                }).openTooltip();
            }
        }

        if (trip.tripPatterns[id].legs[p].fromPlace.quay) {
            let startMarker = L.marker([trip.tripPatterns[id].legs[p].fromPlace.latitude, trip.tripPatterns[id].legs[p].fromPlace.longitude], { icon: PlaceIcon }).addTo(map);
            startMarker.bindTooltip(trip.tripPatterns[id].legs[p].fromPlace.quay.name, {
                permanent: true,
                direction: 'bottom',
                className: 'intermediate-tooltip'
            }).openTooltip();
        } else {
            let startMarker = L.marker([trip.tripPatterns[id].legs[p].fromPlace.latitude, trip.tripPatterns[id].legs[p].fromPlace.longitude], { icon: PlaceIcon }).addTo(map);
            startMarker.bindTooltip(trip.tripPatterns[id].legs[p].fromPlace.name, {
                permanent: true,
                direction: 'bottom',
                className: 'intermediate-tooltip'
            }).openTooltip();
        }
        if (trip.tripPatterns[id].legs[p].toPlace.quay) {
            let endMarker = L.marker([trip.tripPatterns[id].legs[p].toPlace.latitude, trip.tripPatterns[id].legs[p].toPlace.longitude], { icon: PlaceIcon }).addTo(map);
            endMarker.bindTooltip(trip.tripPatterns[id].legs[p].toPlace.quay.name, {
                permanent: true,
                direction: 'bottom',
                className: 'intermediate-tooltip'
            }).openTooltip();
        } else {
            let endMarker = L.marker([trip.tripPatterns[id].legs[p].toPlace.latitude, trip.tripPatterns[id].legs[p].toPlace.longitude], { icon: PlaceIcon }).addTo(map);
            endMarker.bindTooltip(trip.tripPatterns[id].legs[p].toPlace.name, {
                permanent: true,
                direction: 'bottom',
                className: 'intermediate-tooltip'
            }).openTooltip();
        }
        
        
        let tripDiv = document.createElement("div");
        tripDiv.className = "tripDiv";
        
        let legDiv = document.createElement("div");
        legDiv.className = "legDiv";

        detailsEl.appendChild(legDiv);

        let timeDiv = document.createElement("div");
        timeDiv.className = "timeDiv";

        legDiv.appendChild(timeDiv);

        let aimedtimeStartLeg = document.createElement("p");
        aimedtimeStartLeg.className = "aimedtimeStartLeg";
        aimedtimeStartLeg.textContent = new Date(thisDeparture.aimedStartTime).toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });

        timeDiv.appendChild(aimedtimeStartLeg);

        if (thisDeparture.expectedStartTime) {
            let expectedTimeStartLeg = document.createElement("p");
            expectedTimeStartLeg.className = "expectedTimeStartLeg";
            expectedTimeStartLeg.textContent = thisDeparture.expectedStartTime;
        }

        let aimedtimeEndLeg = document.createElement("p");
        aimedtimeEndLeg.className = "aimedtimeEndLeg";
        aimedtimeEndLeg.textContent = thisDeparture.aimedEndTime;

        if (thisDeparture.expectedEndTime) {
        let expectedTimeEndLeg = document.createElement("p");
        expectedTimeEndLeg.className = "expectedTimeEndLeg";
        expectedTimeEndLeg.textContent = thisDeparture.expectedEndTime;
        }
    }
}

// Function to close the overlay
function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
    map.off();
    map.remove();
};

function avgang() {
    nowbuttonEl.classList.remove("selected");
    ankomstbuttonEl.classList.remove("selected");
    avgangbuttonEl.classList.add("selected");
    datetimepickerEl.style.display = "block";
}

function ankomst() {
    nowbuttonEl.classList.remove("selected");
    ankomstbuttonEl.classList.add("selected");
    avgangbuttonEl.classList.remove("selected");
    datetimepickerEl.style.display = "block";
}

function now() {
    nowbuttonEl.classList.add("selected");
    ankomstbuttonEl.classList.remove("selected");
    avgangbuttonEl.classList.remove("selected");
    datetimepickerEl.style.display = "none";
}

function toggle_dark_mode() {
    if (localStorage.getItem("light_mode") === "false") {
        localStorage.setItem("light_mode", "true");
    } else {
        localStorage.setItem("light_mode", "false");
    }
    darkmodecheck()
}
function avansert_ekstra_valg() {
    if (avansert_ekstra_valgEl.style.display === "flex") {
        avansert_ekstra_valgEl.style.display = "none";
        arrowEl.classList.remove("fa-caret-up");
        arrowEl.classList.add("fa-caret-down");
    } else {
        avansert_ekstra_valgEl.style.display = "flex";
        arrowEl.classList.add("fa-caret-up");
        arrowEl.classList.remove("fa-caret-down");
    }
    
}

// Get the input and list elements
const ekskludertelinjerInput = document.getElementById('ekskludertelinjerInput');
const ekskludertelinjerListe = document.getElementById('ekskludertelinjerliste');

// Function to check if a line exists using the Entur API
function checkLineExists(line) {
    const query = `
    query GetLines($publicCode: String!) {
      lines(publicCode: $publicCode) {
        id
        publicCode
      }
    }`;

    const variables = {
        publicCode: line
    };

    return fetch('https://api.entur.io/journey-planner/v3/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': 'alsta017-reiseplanlegger' // Replace with your client name as required by Entur
        },
        body: JSON.stringify({
            query,
            variables
        })
    })
    .then(response => response.json())
    .then(result => result.data.lines && result.data.lines.length > 0);
}

// Function to check if a line is already in the excluded list
function isLineInExcludedList(line) {
    const existingLines = ekskludertelinjerListe.getElementsByClassName('line-tag');
    for (let i = 0; i < existingLines.length; i++) {
        if (existingLines[i].textContent.replace('✕', '').trim() === line) {
            return true;
        }
    }
    return false;
}

// Function to add a line to the excluded list
function addExcludedLine(line) {
    if (line.trim() === '') return;

    // Check if the line exists
    checkLineExists(line).then(exists => {
        if (!exists) {
            alert('Line does not exist.');
            return;
        }

        // Check if the line is already in the excluded list
        if (isLineInExcludedList(line)) {
            alert('Line is already in the excluded list.');
            return;
        }

        const lineTag = document.createElement('div');
        lineTag.className = 'line-tag';
        lineTag.textContent = line;

        // Add a remove button to each line tag
        const removeButton = document.createElement('span');
        removeButton.className = 'remove-line';
        removeButton.textContent = '✕';
        removeButton.onclick = function() {
            ekskludertelinjerListe.removeChild(lineTag);
        };

        lineTag.appendChild(removeButton);
        ekskludertelinjerListe.appendChild(lineTag);

        // Clear the input
        ekskludertelinjerInput.value = '';
    });
}

// Event listener for input field to add line on Enter key
ekskludertelinjerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addExcludedLine(ekskludertelinjerInput.value);
        e.preventDefault();
    }
});

function addLineTag(line, parentId) {
    const parent = document.getElementById(parentId);
    if (parent) {  // Check if the parent element exists
        const tag = document.createElement('span');
        tag.classList.add('line-tag');
        tag.textContent = line;
        tag.onclick = function() { this.remove(); };  // Remove tag on click
        parent.appendChild(tag);
    }
}

function gatherLineNumbers(parentId) {
    const parent = document.getElementById(parentId);
    if (parent) {
        const tags = parent.getElementsByClassName('line-tag');
        return Array.from(tags).map(tag => tag.textContent);
    }
    return [];  // Return an empty array if parent is not found
}

// FIX THIS !!!
// map.on('zoomend', updateTooltipVisibility);

// updateTooltipVisibility();

// function updateTooltipVisibility() {
//     const currentZoom = map.getZoom();
//     const minZoomToShowTooltips = 15; // Set the minimum zoom level to show tooltips

//     map.eachLayer((layer) => {
//         if (layer instanceof L.Marker && layer.getTooltip()) {
//             if (currentZoom >= minZoomToShowTooltips) {
//                 layer.openTooltip();
//             } else {
//                 layer.closeTooltip();
//             }
//         }
//     });
// }

const cookieConsent = document.getElementById("cookieConsent");
const cookieMessage = document.getElementById("cookieMessage");
const acceptCookie = document.getElementById("acceptCookie");
const denyCookie = document.getElementById("denyCookie");


if (!localStorage.getItem("cookiesAccepted") && !localStorage.getItem("cookiesDenied")) {
    cookieConsent.style.display = "block";
}

acceptCookie.addEventListener("click", function() {
    localStorage.setItem("cookiesAccepted", "true");
    cookieConsent.style.display = "none";
});

denyCookie.addEventListener("click", function() {
    localStorage.setItem("cookiesDenied", "true");
    cookieMessage.textContent = "Dine preferanser vil ikke bli lagret. Opplevelsen kan bli dårligere på grunn av dette.";
    acceptCookie.style.display = "none";
    denyCookie.style.display = "none";
    setTimeout(() => {
        cookieConsent.style.display = "none";
    }, 2500);
});

function darkmodecheck() {
    var elements = [document.body];
    for(i = 0; i < elements.length; i++) {
        elements[i].classList.toggle("light_mode");
    }
    fratil.classList.toggle("light_mode2")
    søkeButton.classList.toggle("light_mode2")
    ekstra_valgEl.classList.toggle("light_mode2")
    // Må fikses nedenfor
    fraVelg.classList.toggle("light_mode3")
    tilVelg.classList.toggle("light_mode3")
    fraForm.classList.toggle("light_mode4")
    tilForm.classList.toggle("light_mode4")
    datetimepickerEl.classList.toggle("light_mode2")
    avansert_ekstra_valg_buttonEl.classList.toggle("light_mode")
    byttetididEl.classList.toggle("light_mode")
    byttetiddivEl.classList.toggle("light_mode")
    nowbuttonEl.classList.toggle("light_mode5")
    ankomstbuttonEl.classList.toggle("light_mode5")
    avgangbuttonEl.classList.toggle("light_mode5")
    resultaterEl.classList.toggle("light_mode")
    fraInput.classList.toggle("light_mode4")
    tilInput.classList.toggle("light_mode4")
    ekskludertelinjerInput.classList.toggle("light_mode4")
    detailsEl.classList.toggle("light_mode4")
    ekskludertelinjerdivEl.classList.toggle("light_mode")
}

