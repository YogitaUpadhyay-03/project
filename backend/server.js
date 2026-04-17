import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { WebSocketServer } from "ws";

import verifyToken from "./middleware/auth.js";
import Document from "./models/Document.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lumina_docs")
.then(() => console.log("MongoDB connected"));

app.use("/auth", authRoutes);

/* ================= DOC ROUTES ================= */

app.get("/docs", verifyToken, async (req, res) => {
  const docs = await Document.find().sort({ updatedAt: -1 });
  res.json(docs);
});

app.post("/docs", verifyToken, async (req, res) => {
  const doc = await Document.create({
    title: req.body.title || "Untitled Document",
    content: "",
    updatedAt: new Date()
  });
  res.json(doc);
});

app.get("/docs/:id", verifyToken, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc);
});

app.put("/docs/:id", verifyToken, async (req, res) => {
  await Document.findByIdAndUpdate(req.params.id, {
    content: req.body.content,
    title: req.body.title,
    updatedAt: new Date()
  });
  res.sendStatus(200);
});

app.delete("/docs/:id", verifyToken, async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

/* ================= SERVER ================= */

const server = app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

/* ================= WEBSOCKET ================= */

const wss = new WebSocketServer({ server });

let users = {};

wss.on("connection", ws => {

  ws.on("message", msg => {

    const data = JSON.parse(msg);

    if (data.type === "join") {

      ws.user = data.user;
      users[ws.user.id] = ws.user;

      const allUsers = Object.values(users);

      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "users",
            users: allUsers
          }));
        }
      });

    }

    if (data.type === "content" || data.type === "cursor") {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    }

  });

  ws.on("close", () => {

    if (ws.user) delete users[ws.user.id];

    const allUsers = Object.values(users);

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "users",
          users: allUsers
        }));
      }
    });

  });

});