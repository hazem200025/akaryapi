import React, { useState, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import citiesData from "../../data/cities.json"; // Adjust the import path as per your project structure

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Simulating async fetch from cities.json
    setCities(citiesData);
  }, []);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter" dir="rtl">
      <h1>
        نتائج البحث عن <b>{query.city}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">الموقع</label>
          <select
            id="city"
            name="city"
            onChange={handleChange}
            value={query.city}
          >
            <option value="">اختر مدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">النوع</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">أي</option>
            <option value="buy">شراء</option>
            <option value="rent">إيجار</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">العقار</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">أي</option>
            <option value="apartment">شقة</option>
            <option value="house">منزل</option>
            <option value="condo">شقة مشتركة</option>
            <option value="land">أرض</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">الحد الأدنى للسعر</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="أي"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">الحد الأعلى للسعر</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="أي"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">عدد الغرف</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="أي"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="بحث" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
