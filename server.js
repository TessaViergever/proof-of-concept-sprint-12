// Import the required modules
import express from "express";
// import dotenv from 'dotenv';

// Create a new Express server
const server = express();
// dotenv.config();
const port = process.env.PORT || 4242;

// PHP URL data Sportiek
const sportiekUrl1 = "https://www.sportiek.com/feed/wintersport1.php"; // PHP1: Dorp & skigebied 
const sportiekUrl2 = "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjsonsportiek.json"; // PHP2: Datums, accommodatie info
// https://www.sportiek.com/feed/wintersport2.php?page=3, ?page=4, ?page=5 

const dataSportiek = [[sportiekUrl1], [sportiekUrl2]];
const [data1, data2] = await Promise.all(dataSportiek.map(fetchJson));

const dorpen = {}
const skigebieden = {}

data1.forEach(accommodations => {
  dorpen[accommodations.accomodationId] = accommodations.dorp
  skigebieden[accommodations.accomodationId] = accommodations.skigebied
})


// Set EJS as the template engine and specify the views directory
server.set("view engine", "ejs");
server.set("views", "./views");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
server.use(express.static("public"));

server.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});


// API data 
let filterData = data2.reduce((acc, item) => { 
const existingItem = acc.find((el) => el.variantName === item.variantName);

  if (existingItem) {
    // Only add new date if it's not yet in the list of date items
    if (!existingItem.departureDates.includes(item.departureDate)) {
          existingItem.departureDates.push(item.departureDate);
    }
  } else {
    // Add new item with current variantName and date 
    acc.push({
      accomodationId: item.accomodationId,
      departurePricePersons: item.departurePricePersons,
      variantName: item.variantName,
      complex_name: item.complex_name,
      accomodatie_description: item.accomodatie_description,
      numberOfBeds: item.numberOfBeds,
      bedrooms: item.bedrooms,
      number: item.number,
      skigebied: skigebieden[item.accomodationId],
      dorp: dorpen[item.accomodationId],
      departureDates: [item.departureDate]
    });
  }

  return acc;
}, []);



// unique 
// const complexnamen = []
// const beds = []
// const bedrooms = []

// data.forEach(datadingetje => {
//   if (!complexnamen.includes(datadingetje.complex_name)) {
//     complexnamen.push(datadingetje.complex_name)
//   }
//   if (!beds.includes(datadingetje.numberOfBeds)) {
//     beds.push(datadingetje.numberOfBeds)
//   }
//   if (!bedrooms.includes(datadingetje.bedrooms)) {
//     if (datadingetje.bedrooms != null){
//     bedrooms.push(datadingetje.bedrooms)
//   }}
// })


// Sort function
function sortData(sort_property){
  filterData.sort(function (a, b) {
    if (a[sort_property] < b[sort_property]) {
      return -1
    }
    if (a[sort_property] > b[sort_property]) {
      return 1 
    }
    return 0
  })
}


// Filter function
function dataFilter(filter){
  return filterData.filter(a => {
    for (const key in filter) {
      if (typeof a[key] === "number") a[key] = `${a[key]}`
      if (a[key] !== filter[key]) return false
    }
    return true
  })
}

// Routes
server.get("/", async function (request, response) {
  let { query } = request
  for (const key in query) {
    if (query[key] === '') delete query[key]
  }
  console.log(query);

  let sort = request.query.sort || "complex_name"
  // let complex_name = request.query.complex_name 
  sortData(sort)
  let result = dataFilter(query)
  response.render("index", { filterData: result, data2: data2, dorpen: dorpen, skigebieden: skigebieden,})
})

// server.post("/", (request, response) => {
//   let filter = request.body
//   let result = dataFilter(filter)
//   response.render("index", { filterData: result.length > 0 ? result : filterData, data2: data2, dorpen: dorpen, skigebieden: skigebieden,})
// })

async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}


