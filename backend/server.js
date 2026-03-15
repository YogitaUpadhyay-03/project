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

/* ============================= */
/*       MongoDB connection      */
/* ============================= */

mongoose.connect("mongodb://127.0.0.1:27017/lumina_docs")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


/* ============================= */
/*        AUTH ROUTES            */
/* ============================= */

app.use("/auth", authRoutes);


/* ============================= */
/*       DOCUMENT ROUTES         */
/* ============================= */

/* Get all documents */

app.get("/docs", verifyToken, async (req, res) => {

  const docs = await Document.find().sort({ updatedAt: -1 });

  res.json(docs);

});


/* Create document */

app.post("/docs", verifyToken, async (req, res) => {

  const doc = await Document.create({
    title: "Untitled Document",
    content: "",
    updatedAt: new Date()
  });

  res.json(doc);

});


/* Get single document */

app.get("/docs/:id", verifyToken, async (req, res) => {

  const doc = await Document.findById(req.params.id);

  res.json(doc);

});


/* Update document */

app.put("/docs/:id", verifyToken, async (req, res) => {

  await Document.findByIdAndUpdate(req.params.id, {
    content: req.body.content,
    updatedAt: new Date()
  });

  res.sendStatus(200);

});


/* ============================= */
/*         Start server          */
/* ============================= */

const server = app.listen(5000, () => {

  console.log("Backend running on http://localhost:5000");

});


/* ============================= */
/*        WebSocket Server       */
/* ============================= */

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