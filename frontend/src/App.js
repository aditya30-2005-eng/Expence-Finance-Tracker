import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import API from "./api";   // ✅ API import
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";
import Reports from "./components/Reports";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const addExpense = async (expense) => {
    try {
      const res = await API.post("/expenses", {
        title: expense.title,
        amount: Number(expense.amount),
        type: expense.type,
      });
      setExpenses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const income = expenses
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expense = expenses
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = income - expense;

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
        <Navbar
          expand="lg"
          className={`navbar-custom shadow-lg ${darkMode ? "dark-nav" : ""}`}
        >
          <Navbar.Brand as={Link} to="/" className="brand-text">
            <i className="bi bi-wallet2 me-2"></i> Expense Tracker
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/add">Add Transaction</Nav.Link>
            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
            <button
              className="toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
            <Nav.Link disabled className="author">
              By Aditya Kumar Singh
            </Nav.Link>
          </Nav>
        </Navbar>

        <Container className="mt-5 mb-5 flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Card className="shadow-lg text-center p-3">
                        <h5>💰 Total Income</h5>
                        <h2 className="text-success">₹{income.toLocaleString()}</h2>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="shadow-lg text-center p-3">
                        <h5>🛒 Total Expenses</h5>
                        <h2 className="text-danger">₹{expense.toLocaleString()}</h2>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="shadow-lg text-center p-3">
                        <h5>📊 Balance</h5>
                        <h2 className={balance >= 0 ? "text-primary" : "text-danger"}>
                          ₹{balance.toLocaleString()}
                        </h2>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Card className="shadow-lg p-4">
                        <h5 className="mb-4">📈 Income vs Expenses</h5>
                        <div style={{ height: "350px", width: "100%" }}>
                          <Pie data={chartData} options={chartOptions} />
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </>
              }
            />

            <Route
              path="/add"
              element={
                <Row>
                  <Col md={6}>
                    <div className="card-glass animate__animated animate__fadeInLeft">
                      <h4 className="mb-3">➕ Add New Transaction</h4>
                      <ExpenseForm onAdd={addExpense} />
                    </div>
                    <div className="card-glass mt-4 animate__animated animate__fadeInUp">
                      <h4 className="mb-3">📜 Transaction History</h4>
                      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card-glass animate__animated animate__fadeInRight">
                      <h4 className="mb-3">📊 Expense Chart</h4>
                      <ExpenseChart expenses={expenses} />
                    </div>
                  </Col>
                </Row>
              }
            />

            <Route path="/reports" element={<Reports expenses={expenses} />} />
          </Routes>
        </Container>

        <footer className="footer">
          © {new Date().getFullYear()} Expense Tracker | Built with ❤️ by{" "}
          <b>Aditya Kumar Singh</b>
        </footer>
      </div>
    </Router>
  );
}

export default App;
