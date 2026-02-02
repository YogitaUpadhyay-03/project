import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { WebSocketServer } from "ws";
import Document from "./models/Document.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lumina_docs");

app.get("/docs", async (req, res) => {
  const docs = await Document.find().sort({ updatedAt: -1 });
  res.json(docs);
});

app.post("/docs", async (req, res) => {
  const doc = await Document.create({
    title: "Untitled Document",
    content: "",
    updatedAt: new Date()
  });
  res.json(doc);
});

app.get("/docs/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc);
});

app.put("/docs/:id", async (req, res) => {
  await Document.findByIdAndUpdate(req.params.id, {
    content: req.body.content,
    updatedAt: new Date()
  });
  res.sendStatus(200);
});

const server = app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

/* WebSocket */
const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
  ws.on("message", msg => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(msg.toString());
      }
    });
  });
});