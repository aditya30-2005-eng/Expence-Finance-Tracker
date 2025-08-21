import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function ExpenseChart({ expenses = [] }) {
  if (!expenses.length) return <p>No data to display</p>;

  const chartData = expenses.map((exp) => ({
    name: exp.title,
    value: exp.amount,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#333",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: data.color,
              }}
            ></div>
            <span>{data.name}</span>
          </div>
          <div style={{ marginTop: "4px", color: "#444" }}>
            {data.value.toLocaleString("en-IN")} ₹
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PieChart width={320} height={320}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={110}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </PieChart>
  );
}
