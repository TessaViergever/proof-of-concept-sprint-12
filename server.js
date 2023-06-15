// Import the required modules
import express from "express";

// Create a new Express server
const server = express();
const port = process.env.PORT || 4242;

// PHP URL data Sportiek
// const sportiekUrl = "https://www.sportiek.com/feed/wintersport2.php";

// Temporary data Sportiek for testing (real PHP URL too slow)
const sportiekUrl = "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json";
// const data = await fetch(url).then((response) => response.json()) 

// Set EJS as the template engine and specify the views directory
server.set("view engine", "ejs");
server.set("views", "./views");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
server.use(express.static("public"));

server.get("/", async function (request, response) {
  // const [data1, data2, data3] = await Promise.all(urls.map(fetchJson));
  // const data = { data1: null, data2: null, data3: null };

  fetchJson(sportiekUrl).then((data) => {

    const allIds = [...new Set(data.map(item => item.accomodationId))]
    console.log(data);

    const accomodations = []
    console.log(accomodations)

    allIds.forEach(id => {
      const rows = data.filter(item => {
        return item.accomodationId === id;
      })

      if (rows.length) {
        accomodations[id] = rows
      }
    })

    response.render("index", { data, accomodations: accomodations })

  });
})





server.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});

async function fetchJson(url) {
  return await fetch(sportiekUrl)
    .then((response) => response.json())
    .catch((error) => error);
}

