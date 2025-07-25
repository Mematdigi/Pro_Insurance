import React, { createContext, useState, useEffect, useContext } from "react";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("Life Insurance");

  useEffect(() => {
    const stored = localStorage.getItem("selectedInsuranceType");
    if (stored === "General Insurance" || stored === "Life Insurance") {
      setSelectedCategory(stored);
    } else {
      localStorage.setItem("selectedInsuranceType", "Life Insurance");
      setSelectedCategory("Life Insurance")
    }
  }, []);

  const switchCategory = (newCategory) => {
    setSelectedCategory(newCategory);
    localStorage.setItem("selectedInsuranceType", newCategory);
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, switchCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
