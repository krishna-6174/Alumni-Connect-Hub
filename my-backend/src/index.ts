import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as config from "../config-local";
// import job from "./jobs/index"
import cookieParser from 'cookie-parser';
import coreRouter from "./coreRouter"
import path from 'path';
const app = express();
const port = 6969;
 // Allow requests from other origins
app.use(cors({
  origin: '*', // Frontend's origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/Gallery', express.static(path.join(__dirname, '../Gallery')));
// app.use('/',job)
app.use('/',coreRouter)

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});


// function gracefulClose(signal: string) {
//   logger.log("info", `Received ${signal} initiating server close`);
//   server.close(() => logger.log("info", "Server closed"));
//   process.exit();
// }

// display all the avaiable routes in the app
// set env=dev in .env to enable it
if (config.env === "dev") {
  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(
        print.bind(null, path.concat(split(layer.route.path)))
      );
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach(
        print.bind(null, path.concat(split(layer.regexp)))
      );
    } else if (layer.method) {
      console.log(
        "%s /%s",
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join("/")
      );
    }
  }

  function split(thing: any) {
    if (typeof thing === "string") {
      return thing.split("/");
    } else if (thing.fast_slash) {
      return "";
    } else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">";
    }
  }
  console.log("All avaible endpoints: \n");
  app._router.stack.forEach(print.bind(null, []));
  console.log();
}

// process.on("SIGINT", gracefulClose);
// process.on("SIGTERM", gracefulClose);