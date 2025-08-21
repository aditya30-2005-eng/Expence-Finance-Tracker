import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: { type: String, default: "general" }, // ✅ optional rakha
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

