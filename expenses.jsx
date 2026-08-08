import React from "react";

export default function Expenses() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Expenses</h1>
      <p>Manage and track your daily expenses here.</p>

      <div
        style={{
          marginTop: "24px",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2>Add Expense</h2>

        <input
          type="text"
          placeholder="Expense name"
          style={{ padding: "10px", marginRight: "10px" }}
        />

        <input
          type="number"
          placeholder="Amount"
          style={{ padding: "10px", marginRight: "10px" }}
        />

        <button style={{ padding: "10px 16px" }}>
          Add Expense
        </button>
      </div>
    </div>
  );
}
