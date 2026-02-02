const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

/*
  1️⃣ Create document with default "main" branch
  Browser testable
*/
router.get('/create', async (req, res) => {
  try {
    const doc = new Document({
      title: 'My Collaborative Document',
      branches: [
        { name: 'main', content: '' }
      ]
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  2️⃣ Get all documents
*/
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  3️⃣ Get all branches of a document
*/
router.get('/branches/:docId', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    res.json(doc.branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  4️⃣ Create a new branch from main branch
  Browser testable
*/
router.get('/create-branch/:docId/:branchName', async (req, res) => {
  try {
    const { docId, branchName } = req.params;
    const doc = await Document.findById(docId);

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const mainBranch = doc.branches.find(b => b.name === 'main');
    if (!mainBranch) {
      return res.status(400).json({ error: 'Main branch not found' });
    }

    doc.branches.push({
      name: branchName,
      content: mainBranch.content
    });

    await doc.save();
    res.json(doc.branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  5️⃣ Update branch content (used by editor)
*/
router.post('/update-branch', async (req, res) => {
  try {
    const { docId, branchName, content } = req.body;
    const doc = await Document.findById(docId);

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const branch = doc.branches.find(b => b.name === branchName);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });

    branch.content = content;
    await doc.save();

    res.json({ message: 'Branch updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;