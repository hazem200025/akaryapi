import React, { useState, useEffect } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
import citiesData from "../../data/cities.json"; // Adjust the import path as per your project structure

// Define the types with Arabic display and corresponding English values
const types = [
  { display: "شراء", value: "buy" },
  { display: "إيجار", value: "rent" }
];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Simulating async fetch from cities.json
    setCities(citiesData);
  }, []);

  const switchType = (val) => {
    const selectedType = types.find(item => item.display === val);
    if (selectedType) {
      setQuery((prev) => ({ ...prev, type: selectedType.value }));
    }
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results page
    const { type, city, minPrice, maxPrice } = query;
    const searchParams = `?type=${type}&city=${city}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    window.location.href = `/list${searchParams}`;
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => switchType(type.display)}
            className={query.type === type.value ? "active" : ""}
          >
            {type.display}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          <select name="city" onChange={handleChange} value={query.city} className="select-city">
            <option value="">اختر مدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              min={0}
              max={10000000}
              placeholder="السعر الأدنى"
              onChange={handleChange}
              className="input-price"
            />
            <input
              type="number"
              name="maxPrice"
              min={0}
              max={10000000}
              placeholder="السعر الأقصى"
              onChange={handleChange}
              className="input-price"
            />
          </div>
          <button type="submit" className="search-button">
            <img src="/search.png" alt="بحث" className="search-icon" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
