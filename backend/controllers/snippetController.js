const Snippet = require("../models/snippetModel");

// Get all snippets
exports.getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single snippet by ID
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new snippet
exports.createSnippet = async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const newSnippet = await Snippet.create({ title, content, language });
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a snippet
exports.updateSnippet = async (req, res) => {
  try {
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSnippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a snippet
exports.deleteSnippet = async (req, res) => {
  try {
    const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);
    if (!deletedSnippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.status(200).json({ message: "Snippet deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
