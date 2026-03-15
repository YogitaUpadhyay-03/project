# Real-Time Collaborative Editor

## Overview
A Google Docs–like collaborative text editor supporting real-time multi-user editing using WebSockets.

## Features
- Real-time document collaboration
- Operational Transformation / CRDT conflict resolution
- Version history with Git-like branching
- MongoDB storage for immutable edit operations
- Export to PDF and Markdown
- Role-based document permissions

## Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express, WebSocket
Database: MongoDB

## Architecture
(Client) → WebSocket → Express Server → MongoDB

## Installation
git clone ...
cd project
npm install

## Run
npm start
