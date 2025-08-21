import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// ✅ Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category } = req.body; // <-- category include
    const newExpense = new Expense({ title, amount, type, category });
    const saved = await newExpense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
