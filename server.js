// Import the required modules
import express from "express";

// Create a new Express server
const server = express();
const port = process.env.PORT || 4242;

// PHP URL data Sportiek
// const sportiekUrl1 = "https://www.sportiek.com/feed/wintersport1.php"; // PHP1: Dorp & skigebied 
// const sportiekUrl2 = "https://www.sportiek.com/feed/wintersport2.php"; // PHP2: Datums, accommodatie info
// https://www.sportiek.com/feed/wintersport2.php?page=3, ?page=4, ?page=5 

// Snippet of data (Sportiek PHP URL = slow)
// https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json

const sportiekUrl1 = "https://www.sportiek.com/feed/wintersport1.php"; // PHP1: Dorp & skigebied 
const sportiekUrl2 = "https://www.sportiek.com/feed/wintersport2.php"; // PHP2: Datums, accommodatie info

const dataSportiek = [[sportiekUrl1], [sportiekUrl2]];
const [data1, data2] = await Promise.all(dataSportiek.map(fetchJson));
const data = { data1, data2 };

// Randomised data - trial
// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// // possible availability of accommodations
// const possibleAvailability = ['1', '2', '3', '4', '5','6', '7', '8', '9', '10','11', '12', '13', '14', '15', ]
// const maxFromPossibleAvailability = possibleAvailability.length - 1

// data.accomodation.departureDates.forEach(function(availability) {
//   if (!departureDate.skiSeason) {
//     availability.accomodationAvailability = []
//     availability.accomodationAvailability.push(possibleAvailability[getRandomInt(maxFromPossibleAvailability)])
//   }
// })

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

server.get("/", async function (request, response) {
  response.render("index", { data, filterData: filterData })
})


// iets met API data 
const filterData = data2.reduce((acc, item) => { // hoe: data1 hier ook bij?
  const existingItem = acc.find((el) => el.variantName === item.variantName);

  if (existingItem) {
    // Voeg de huidige datum alleen toe als deze nog niet in de bestaande item is opgenomen
    if (!existingItem.departureDates.includes(item.departureDate)) {
      existingItem.departureDates.push(item.departureDate);
    }
  } else {
    // Voeg een nieuw item toe met de huidige variantName en datum
    acc.push({
      accomodationId: item.accomodationId,
      departurePricePersons: item.departurePricePersons,
      variantName: item.variantName,
      complex_name: item.complex_name,
      accomodatie_description: item.accomodatie_description,
      numberOfBeds: item.numberOfBeds,
      bedrooms: item.bedrooms,
      // skigebied: skigebied,
      // dorp: dorp,
      departureDates: [item.departureDate]
    });
  }

  return acc;
}, []);

console.log(filterData)


//sort function
function sortData(sort_property){
  data.sort(function (a, b) {
    if (a[sort_property] < b[sort_property]) {
      return -1
    }
    if (a[sort_property] > b[sort_property]) {
      return 1 
    }
    return 0
  })
}

 // filter function
  // function filterData(filter_property){
  //   const filteredData = data.filter(data => data.filter_property == filter_property)
  // }

//route
server.get("/", async function (request, response) {
  let sort = request.query.sort || "complex_name"
  let complex_name = request.query.complex_name 
  sortData(sort)
  filterData(complex_name)
  response.render("index", { data: data, data2: data2})
})

async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}


