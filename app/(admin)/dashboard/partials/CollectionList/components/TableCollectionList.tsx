import React from "react";

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

interface CollectionListProps {
  collections: CollectionFetch[];
}

const TableCollectionList:React.FC<CollectionListProps> = ({collections}) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr>
          <th className="text-left">Collection Name</th>
          <th className="text-left">Created At</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {collections.map((collection, index) => (
          <tr 
            key={collection.id} 
            className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
          >
            <td>{collection.name}</td>
            <td>{new Date(collection.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })}</td>
            <td>{collection.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableCollectionList;
