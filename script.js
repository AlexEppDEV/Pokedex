
const BASE_URL = "https://remotestorage-5a38a-default-rtdb.europe-west1.firebasedatabase.app/";

let inputDataTitle = "film";
let inputData = " Star trek";

function init() {
    console.log(" Testen firebase")
    // fetchDateBase("/name", {"star": "Treck"});
    // postDateBase("/name", {"star": "Treck"});
    // deleteDateBase("/name/",{"serie": "star wars"});
    putDateBase("/name/Film",{[inputDataTitle] : inputData});
};

function userContentInput () {
    let valueKeyInput = document.getElementById("key_input").value;
    let valueContentInput = document.getElementById("content_input").value;
    console.log(valueContentInput, valueKeyInput);
   postDateBase("/name/Film",{[valueKeyInput] : valueContentInput});
};


async function putDateBase(path="", data={}) {

    let response = await fetch(BASE_URL + path + ".json",{
        method : "PUT",
        headers: {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(data)
    });
    return responseToJson = await response.json();
    console.log(responseToJson);
};




// mit POST sendet man daten in die datenbank wichtig auf dem path aufpssen das der richtig ist 

async function postDateBase(path="", data={}) {

    let response = await fetch(BASE_URL + path + ".json",{
        method : "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(data)
    });
    return responseToJson = await response.json();
    console.log(responseToJson);
};

async function fetchDateBase(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
    console.log(responseToJson); 
};

// inhalt von datenbank  löschen wichtig kein leer path eingeben sonst wir alles gelöscht
// einzelne padte/id angeben zum löschen
async function deleteDateBase(path="", data={}) {

    let response = await fetch(BASE_URL + path + ".json",{
        method : "DELETE",
    });
    return responseToJson = await response.json();
    console.log(responseToJson);  
};





