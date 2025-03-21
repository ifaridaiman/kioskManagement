import React from "react";
import { IoMdClose } from "react-icons/io";
import { useCategoryMaker } from "../../context/CategoryMakerContext";

const CategoryAdd = () => {
  const { state, handleChange, toggleShowAddCategoryModal, handleSubmit } =
    useCategoryMaker();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-10 absolute top-0 left-0">
      <div className="bg-white p-4 rounded min-w-80">
        <div className="flex items-bottom justify-between ">
          <p className="font-bold text-gray-700">Add New Category</p>
          <button onClick={toggleShowAddCategoryModal}>
            <IoMdClose className="text-xl" />
          </button>
        </div>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={state.title}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={state.description}
                  onChange={handleChange}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 w-full "
              >
                Submit
              </button>
              <button
                type="button"
                onClick={toggleShowAddCategoryModal}
                className="px-4 py-2 text-gray-500 bg-gray-300 font-semibold rounded-md shadow hover:bg-gray-600 w-full "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;
