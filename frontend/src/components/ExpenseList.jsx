import React from "react";
import API from "../api";

export default function ExpenseList({ expenses = [], onDelete }) {
  if (!expenses.length) {
    return <p className="text-muted">No expenses yet.</p>;
  }

  const deleteHandler = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      onDelete(id);
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
    }
  };

  return (
    <ul className="expense-list">
      {expenses.map((exp) => (
        <li key={exp._id}>
          <span>{exp.title}</span>
          <span>₹{exp.amount}</span>
          <button
            className="delete-btn"
            onClick={() => deleteHandler(exp._id)}
            title="Delete"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
