import React from "react";

export default function ExpenseList({ expenses = [], onDelete }) {
  if (!expenses.length) {
    return <p className="text-muted">No expenses yet.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((exp) => (
        <li key={exp._id}>
          <span>{exp.title}</span>
          <span>₹{exp.amount}</span>
          <button
            className="delete-btn"
            onClick={() => onDelete(exp._id)} // ✅ fix: use _id
            title="Delete"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
