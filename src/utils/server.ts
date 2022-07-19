import express from "express";
import bodyParser from "body-parser";

export default function createServer() {
  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  return server;
}
