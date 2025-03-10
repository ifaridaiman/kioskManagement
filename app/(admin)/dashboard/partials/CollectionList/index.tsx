"use client";
import React, { useState, useEffect } from "react";
import { BiCaretDown } from "react-icons/bi";
import TableCollectionList from "./components/TableCollectionList";

interface CollectionFetch {
  id: string;
  name: string;
  secret: string;
  payment_gateway: string;
  collection_key: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const CollectionList = () => {
  const [collections, setCollections] = useState<CollectionFetch[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>("");

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collections`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const submitCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newCollectionName.trim()) {
      alert("Collection name is required!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newCollectionName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      setNewCollectionName(""); // Clear input field
      fetchCollections(); // Refresh the list
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleCollapse}
      >
        <p className="font-bold">Collection List</p>
        <BiCaretDown className={`transition-transform ${isCollapsed ? "rotate-180" : "rotate-0"}`} />
      </div>

      {isCollapsed && (
        <div className="border-t border-slate-200 mt-4">
          <TableCollectionList collections={collections} />
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-base font-bold">Create new Collection</p>
            <p className="text-base font-light">
              Once you create a new collection, it will deactivate the old collection.
            </p>

            <form onSubmit={submitCreateCollection} className="flex gap-2 justify-between items-center mt-4">
              <div className="w-2/3">
                <p className="text-base font-bold">Collection Name</p>
                <input
                  type="text"
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="border border-slate-200 rounded p-2 w-full mt-2"
                />
              </div>
              <div className="w-1/3 flex justify-end">
                <button type="submit" className="bg-blue-500 w-full text-white rounded p-2 mt-8">
                  Create New Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
