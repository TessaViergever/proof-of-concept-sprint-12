// Import the required modules
import express from "express";

// Create a new Express server
const server = express();
const port = process.env.PORT || 4242;

// PHP URL data Sportiek
// const sportiekUrl = "https://www.sportiek.com/feed/wintersport2.php";

// Temporary data Sportiek for testing (real PHP URL too slow)

const sportiek =
  "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json";
const sportiekone = "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json";

const datasportiek = [[sportiek], [sportiekone]];
const [data1, data2] = await Promise.all(datasportiek.map(fetchJson));
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

const filterData = data1.reduce((acc, item) => {
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
      departureDates: [item.departureDate]
    });
  }

  return acc;
}, []);

console.log(filterData)

async function fetchJson(url) {
  return await fetch(sportiekone)
    .then((response) => response.json())
    .catch((error) => error);
}


