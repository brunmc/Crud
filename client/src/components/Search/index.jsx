import React from "react";
import "./style.css";

const Search = ({ searchTerm, handleSearchChange }) => {
  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Search;
