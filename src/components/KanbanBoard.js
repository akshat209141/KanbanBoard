import React from "react";
import "../styles/KanbanBoard.css";
import img from "../assets/dummy_profile.jpeg";
const getPriorityLabel = (priority) => {
    switch (priority) {
      case "4":
        return { label: "Urgent", icon: "🔥", className: "priority-urgent" };
      case "3":
        return { label: "High", icon: "⚠️", className: "priority-high" };
      case "2":
        return { label: "Medium", icon: "ℹ️", className: "priority-medium" };
      case "1":
        return { label: "Low", icon: "⬇️", className: "priority-low" };
      case "0":
        return { label: "No Priority", icon: "➖", className: "priority-none" };
      default:
        return { label: "Unknown", icon: "❓", className: "priority-unknown" };
    }
  };

  const getColumnIcon = (group, grouping) => {
    if (grouping === "status") {
      switch (group) {
        case "Todo":
          return "📝";
        case "In progress":
          return "🚧";
        case "Done":
          return "✅";
        case "Canceled":
        return "❌";
        default:
          return "📋";
      }
    } else if (grouping === "priority") {
      return getPriorityLabel(group).icon || "📌";
    } else if (grouping === "user") {
      return "👤";
    }
    return "📋"; // Default icon
  };

const   KanbanBoard = ({ tickets, users, grouping, ordering }) => {
  // Group tickets dynamically based on the grouping type
  const groupTickets = () => {
    const grouped = {};
    if (grouping === "status") {
      tickets.forEach((ticket) => {
        if (!grouped[ticket.status]) grouped[ticket.status] = [];
        grouped[ticket.status].push(ticket);
      });
    } else if (grouping === "user") {
      tickets.forEach((ticket) => {
        const user = users.find((user) => user.id === ticket.userId);
        const userName = user ? user.name : "Unknown";
        if (!grouped[userName]) grouped[userName] = [];
        grouped[userName].push(ticket);
      });
    } else if (grouping === "priority") {
      tickets.forEach((ticket) => {
        if (!grouped[ticket.priority]) grouped[ticket.priority] = [];
        grouped[ticket.priority].push(ticket);
      });
    }
    return grouped;
  };

  // Sort tickets within groups
  const sortTickets = (tickets) => {
    if (ordering === "priority") {
      return [...tickets].sort((a, b) => b.priority - a.priority);
    } else if (ordering === "title") {
      return [...tickets].sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const groupedTickets = groupTickets();

  return (
    <div className="kanban-board">
      {Object.keys(groupedTickets).map((group) => {
        
        const priorityInfo = grouping === "priority" ? getPriorityLabel(group) : null;

          const ticketCount = groupedTickets[group].length;
          const columnIcon = getColumnIcon(group, grouping);

        return (
          <div key={group} className="kanban-column">
            <h2 className="column-header">
            {columnIcon}{" "}
              {grouping === "priority" && priorityInfo ? (
                <>
                  {priorityInfo.label} {ticketCount}
                </>
              ) : (
                `${group} ${ticketCount}`
              )}
            </h2>
            <div className="tickets-container">
              {sortTickets(groupedTickets[group]).map((ticket) => {
                const user = users.find((user) => user.id === ticket.userId);

                return (
                  <div key={ticket.id} className={`ticket`}>
                     <div className="ticket-header">
                      <h3>{ticket.id}</h3>
                      <div className="ticket-user">
                        <img
                          src={img} // Replace with the actual image URL or placeholder
                          alt="User Avatar"
                          className="user-avatar"
                        />
                      </div>
                    </div>
                    <div className="ticket-body">
                      <h3 className="ticket-title">{ticket.title}</h3>
                      <div className="ticket-tags">
                        {ticket.tag.map((tag, index) => (
                          <span key={index} className="ticket-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div> 
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};



export default KanbanBoard;
