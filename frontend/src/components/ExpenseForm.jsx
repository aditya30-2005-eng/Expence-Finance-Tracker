import React, { useState } from "react";

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Other");

  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(),
    });

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Other");
  };

  return (
    <form
      onSubmit={submitHandler}
      className="p-4 border rounded shadow-sm bg-light"
    >
      <div className="mb-3">
        <label className="form-label fw-bold text-dark">Type</label>
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">💰 Income (Salary / Bonus)</option>
          <option value="expense">🛒 Expense</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold text-dark">
          {type === "income" ? "Income Source" : "Expense Title"}
        </label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            type === "income"
              ? "e.g. Salary, Bonus"
              : "e.g. Groceries, Rent"
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold text-dark">Amount (₹)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold text-dark">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Other</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Rent</option>
          <option>Salary</option>
          <option>Investment</option>
          <option>Bills</option>
        </select>
      </div>

      <button
        type="submit"
        className={`btn w-100 ${
          type === "income" ? "btn-success" : "btn-danger"
        }`}
      >
        {type === "income" ? "➕ Add Income" : "➖ Add Expense"}
      </button>
    </form>
  );
}
