const http = require("http");
const path = require("path");
const app = require("./app");
const server = http.createServer(app);

const router = require("./routes/index");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 4001;

app.use("*", (_req, res) => {
res.sendFile(path.join(__dirname, "/static/static/index.html"));
});

//routes
app.use("/api", router);


// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
