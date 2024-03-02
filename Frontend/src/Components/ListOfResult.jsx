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
      <h1 className="title_results">Added Products</h1>
      <section className="section_all_results">
        {result.map((item, index) => (
          <section key={index} className="section_individual_result">
            <article>
              <p className="p_results">Product Name</p>
              <p className="product_result">{item.ProductName}</p>
              
              <p className="p_results">Category ID</p>
              <p className="product_result">{item.CategoryID}</p>
              <p className="p_results">Unit</p>
              <p className="product_result">{item.Unit}</p>
              <p className="p_results">Price</p>
              <p className="product_result">{item.Price}</p>
            </article>
            <div className="div_buttons_results">
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
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}

export default ListOfResult;