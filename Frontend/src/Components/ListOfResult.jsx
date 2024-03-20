import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ListOfResult.css";

function ListOfResult() {
// Stores and updates the information received from the backend.
const [result, setResult] = useState([]);

useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

// Detects which information card we're clicking on, retrieves the ProductID, and sends it to the backend, which will be responsible for deleting the data from the database.
  const handleDelete = (e) => {
    console.log(e.target.name);
if (confirm("Are you sure you want to delete this information")) {
console.log("Informação excluída");
      fetch("http://localhost:3000", {
        method: "DELETE",
        body: JSON.stringify({
          ["ProductID"]: e.target.name,
        }),
        headers: { "Content-Type": "application/json" },
      });
// Refreshes the page to update the database data.
window.location.reload();
    } else {
      console.log("Deletion request cancelled.");
    }
  };

  return (
    <div className="results">
      <table className="table_results">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category ID</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index}>
              <td>{item.ProductName}</td>
              <td>{item.CategoryID}</td>
              <td>{item.Unit}</td>
              <td>{item.Price}</td>
              <td>
                <Link to={`/modify/${item.ProductID}`}>
                  <button className="modify_results">Edit</button>
                </Link>
                <button
                  name={item.ProductID}
                  onClick={handleDelete}
                  className="delete_results"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
          }  

export default ListOfResult;