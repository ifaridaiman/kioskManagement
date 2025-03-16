import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface MenuUploadImageProps {
  menuId: string;
  menuTitle: string;
  toggleShowUpdateMenuModal: () => void;
}

const MenuUploadImage: React.FC<MenuUploadImageProps> = ({
  menuId,
  menuTitle,
  toggleShowUpdateMenuModal,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menus/assets/${menuId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image. Please try again.");
      }

      setSuccess(true);
      setSelectedFile(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-10 absolute top-0 left-0">
      <div className="bg-white p-4 rounded min-w-80 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-700">Upload Image for {menuTitle}</p>
          <button onClick={toggleShowUpdateMenuModal}>
            <IoMdClose className="text-xl text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        <div className="py-4">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col gap-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 px-4 py-2 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">Image uploaded successfully!</p>}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={toggleShowUpdateMenuModal}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuUploadImage;
