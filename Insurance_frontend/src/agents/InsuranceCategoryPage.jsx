import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import generalIcon from "/public/General_insurance.png";
import lifeIcon from "/public/Life_insurance.png";

const InsuranceCategoryPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
  if (selected) {
    // Store the full label for consistency with Excel data
    const selectedLabel = selected === "life" ? "Life Insurance" : "General Insurance";
    localStorage.setItem("selectedInsuranceCategory", selectedLabel);

    navigate("/agent/dashboard");
  }
};


  return (
    <div className="insurance-category-page container">
      <h2 className="page-title">Select Your Insurance Category</h2>
      <p className="page-subtitle">
        Please choose the type of insurance you'd like to manage today. This will help us
        customize your dashboard experience.
      </p>

      <div className="category-grid">
        <div
          className={`category-card ${selected === "general" ? "active" : ""}`}
          onClick={() => setSelected("general")}
        >
          <img src={generalIcon} alt="General Insurance" className="category-img" />
          <h5>General Insurance</h5>
          <p>
            Protect your assets and health with comprehensive coverage for everyday risks.
          </p>
          <small className="text-muted">Vehicle, Health, Travel, Property Insurance</small>
        </div>

        <div
          className={`category-card ${selected === "life" ? "active" : ""}`}
          onClick={() => setSelected("life")}
        >
          <img src={lifeIcon} alt="Life Insurance" className="category-img" />
          <h5>Life Insurance</h5>
          <p>
            Secure your family’s financial future with long-term life protection plans.
          </p>
          <small className="text-muted">Term Life, Whole Life, ULIP, Endowment Plans</small>
        </div>
      </div>

      <div className="actions text-center mt-4">
        <button
          className="btn btn-primary btn-lg px-4"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue to Dashboard
        </button>
        
      </div>

      <div className="footnotes mt-4 text-center text-muted">
        <span>🔵 Secure & Trusted</span>
        <span className="mx-3">🔵 Easy to Manage</span>
        <span>🔵 Expert Support</span>
      </div>
    </div>
  );
};

export default InsuranceCategoryPage;
