import React from "react";
import CollectionList from "./partials/CollectionList";

const SettingPage = () => {
  return (
    <div className="pt-10 px-8">
      {/* <DigitSummary/> */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 font-semibold">Setting</h1>
      </div>
      <CollectionList />
    </div>
  );
};

export default SettingPage;
