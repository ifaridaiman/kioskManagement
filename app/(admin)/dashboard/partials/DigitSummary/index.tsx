import React from "react";
import Card from "./components/Card";

const DigitSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card summaryTotal={50000} summaryDescription="Total order till Today" />
      <Card summaryTotal={5000} summaryDescription="Total order for Today" />
      <Card summaryTotal={1000} summaryDescription="Total order for Tomorrow" />
    </div>
  );
};

export default DigitSummary;
