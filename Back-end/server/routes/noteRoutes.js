import express from "express";
import Note from "../models/notes.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(verifyToken);

// جلب كل الملاحظات
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
    console.log(notes);
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
});

// إنشاء ملاحظة جديدة
router.post("/", async (req, res) => {
  try {
    const { _id, title, content , updatedAt } = req.body;
    
    const newNote = new Note({_id, title, content, userId: req.userId , updatedAt});
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
});

// تعديل ملاحظة
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title: req.body.title, 
        content: req.body.content, 
        deleted: req.body.deleted,
        updatedAt: req.body.updatedAt },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId});
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note", error: err.message });
  }
});

// حذف ملاحظة
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message });
  }
});

export default router;
