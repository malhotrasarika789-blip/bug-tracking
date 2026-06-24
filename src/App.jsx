import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bugs, setBugs] = useState(() => {
    const savedBugs = localStorage.getItem("bugs");
    return savedBugs ? JSON.parse(savedBugs) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  useEffect(() => {
    localStorage.setItem("bugs", JSON.stringify(bugs));
  }, [bugs]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const newBug = {
      id: Date.now(),
      ...formData,
      status: "Open",
    };

    setBugs((prev) => [...prev, newBug]);

    setFormData({
      title: "",
      description: "",
      priority: "low",
    });
  };

  const handleDelete = (id) => {
    setBugs((prev) =>
      prev.filter((bug) => bug.id !== id)
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setBugs((prev) =>
      prev.map((bug) =>
        bug.id === id
          ? { ...bug, status: newStatus }
          : bug
      )
    );
  };

  const filteredBugs = bugs
    .filter((bug) =>
      bug.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((bug) =>
      filterPriority === "all"
        ? true
        : bug.priority === filterPriority
    );

  const openCount = bugs.filter(
    (bug) => bug.status === "Open"
  ).length;

  const inProgressCount = bugs.filter(
    (bug) => bug.status === "In Progress"
  ).length;

  const closedCount = bugs.filter(
    (bug) => bug.status === "Closed"
  ).length;

  return (
    <div className="container">
      <h1>🐞 Bug Tracker Pro</h1>

      <p className="subtitle">
        Track, manage and resolve bugs efficiently
      </p>

      <div className="dashboard">
        <div className="stat-card">
          <h2>{bugs.length}</h2>
          <p>🐞 Total Bugs</p>
        </div>

        <div className="stat-card">
          <h2>{openCount}</h2>
          <p>🟠 Open</p>
        </div>

        <div className="stat-card">
          <h2>{inProgressCount}</h2>
          <p>🛠️ In Progress</p>
        </div>

        <div className="stat-card">
          <h2>{closedCount}</h2>
          <p>✅ Closed</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Add New Bug</h2>

        <input
          type="text"
          name="title"
          placeholder="🐛 Enter bug title..."
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="📝 Describe the bug..."
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">🟢 Low Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="high">🔴 High Priority</option>
        </select>

        <button type="submit">
          ➕ Add Bug
        </button>
      </form>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search bugs..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value)
          }
        >
          <option value="all">
            All Priorities
          </option>
          <option value="low">🟢 Low</option>
          <option value="medium">
            🟡 Medium
          </option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      {filteredBugs.length === 0 ? (
        <p className="no-bugs">
          🚀 No bugs yet!
          <br />
          Add your first bug above.
        </p>
      ) : (
        filteredBugs.map((bug) => (
          <div
            className="bug-card"
            key={bug.id}
          >
            <h3>{bug.title}</h3>

            <p>{bug.description}</p>

            <p>
              <strong>Priority:</strong>{" "}
              {bug.priority}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {bug.status}
            </p>

            <div className="actions">
              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  handleDelete(bug.id)
                }
              >
                🗑 Delete
              </button>

              <select
                value={bug.status}
                onChange={(e) =>
                  handleStatusChange(
                    bug.id,
                    e.target.value
                  )
                }
              >
                <option value="Open">
                  🟠 Open
                </option>
                <option value="In Progress">
                  🛠️ In Progress
                </option>
                <option value="Closed">
                  ✅ Closed
                </option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;