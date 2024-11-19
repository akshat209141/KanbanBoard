import React, { useEffect, useState, useRef } from "react";
import KanbanBoard from "./KanbanBoard";
import "../styles/Main.css";

const Main = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [grouping, setGrouping] = useState(() => localStorage.getItem("grouping") || "status");
    const [ordering, setOrdering] = useState(() => localStorage.getItem("ordering") || "priority");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment"); // Replace with actual API endpoint
            console.log(response);
            const data = await response.json();
            setTickets(data.tickets);
            setUsers(data.users);
        };
        const savedGrouping = localStorage.getItem("grouping");
        const savedOrdering = localStorage.getItem("ordering");
        fetchData();
        if (savedGrouping === "status" || savedOrdering === "priority") {
            setGrouping(savedGrouping);
            setOrdering(savedOrdering);
        }
    }, []);

    // Save view state in localStorage
    useEffect(() => {
        localStorage.setItem("grouping", grouping);
        localStorage.setItem("ordering", ordering);
    }, [grouping, ordering]);

    // Load view state from localStorage
    useEffect(() => {
        const savedGrouping = localStorage.getItem("grouping");
        const savedOrdering = localStorage.getItem("ordering");
        if (savedGrouping) setGrouping(savedGrouping);
        if (savedOrdering) setOrdering(savedOrdering);
    }, [grouping, ordering]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log("down l");
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Close dropdown only if click happens outside
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="main-container">
            <header>
                <div className="controls">
                    <div className="dropdown" ref={dropdownRef}>
                        <button
                            className="dropdown-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Display ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item">
                                    <label htmlFor="grouping" className="inline-label">Grouping</label>
                                    <select
                                        id="grouping"
                                        value={grouping}
                                        onChange={(e) => setGrouping(e.target.value)}
                                        className="inline-select"
                                    >
                                        <option value="status">Status</option>
                                        <option value="user">User</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                </div>
                                <div className="dropdown-item">
                                    <label htmlFor="ordering">Ordering</label>
                                    <select
                                        id="ordering"
                                        value={ordering}
                                        onChange={(e) => setOrdering(e.target.value)}
                                    >
                                        <option value="priority">Priority</option>
                                        <option value="title">Title</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <KanbanBoard tickets={tickets} users={users} grouping={grouping} ordering={ordering} />
        </div>
    );
};

export default Main;
