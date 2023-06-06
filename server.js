// Import the required modules
import express from "express";

// Create a new Express app
const app = express();
const port = process.env.PORT || 4242;
// php file from sportiek
const sportiek = "https://www.sportiek.com/feed/wintersport2.php";

// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", async function (request, response) {
  fetchJson(sportiek).then((data) => {
    console.log(data);
    response.render("index", data);
  });
});

app.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});

async function fetchJson(url) {
  return await fetch(sportiek)
    .then((response) => response.json())
    .catch((error) => error);
}