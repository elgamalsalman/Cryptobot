import path from "path";
import fs from "fs";

import express from "express";

const router = express.Router();

router.use("/", (request, response, next) => {
  response.sendFile(path.join(process.cwd(), "views", "botview.html"));
  //const data = fs.readFile(
  //  path.join(process.cwd(), "data", "SOLETH.json"),
  //  (err, data) => {
  //    console.log(data);
  //    response.sendFile(path.join(process.cwd(), "views", "botview.html"));
  //  }
  //);
});

export default router;
