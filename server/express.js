const express = require("express");
const fs = require("fs");
var cors = require('cors')
const path = require("path");
const React = require("react");
require('dotenv').config()
const ReactDOMServer = require("react-dom/server");
const { StaticRouter } = require("react-router-dom");
const app = express();
const { App } = require("../src/components/app");
const routes = require( './routes' )
const bodyParser = require('body-parser');
const logger = require("./logger")
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(/\.js?$/,express.static(path.resolve(__dirname, "../dist")))

app.get(
  /\.(js|css|map|ico|png|jsx)$/,
  express.static(path.resolve(__dirname, "../dist"))
);


app.disable('etag');
app.use(routes)

app.use("*", async (req, res) => {

  let componentData = {};
  let indexHTML = fs.readFileSync(
    path.resolve(__dirname, "../dist/index.html"),
    {
      encoding: "utf8",
    }
  );
  let appHTML = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={componentData}>
      <App />
    </StaticRouter>
  );

  indexHTML = indexHTML.replace(
    '<div id="app"></div>',
    `<div id="app">${appHTML}</div>`
  );

  res.contentType("text/html");
  res.status(200);

  return res.send(indexHTML);
});

app.listen(process.env.PORT || 8080, () => {
  logger.info(`Express server started at http://localhost:${process.env.PORT || 8080}`);
});
