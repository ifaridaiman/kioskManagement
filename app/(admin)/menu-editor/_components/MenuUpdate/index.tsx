import React, { useEffect } from "react";
import { useMenuMaker } from "../../context/MenuMakerContext";
import { IoMdClose } from "react-icons/io";

interface MenuUpdateProps {
  id: number;
  title: string;
  description: string;
  price: number;
  // onUpdate: () => void;
}

const MenuUpdate: React.FC<MenuUpdateProps> = ({ id, title, description, price }) => {
  const { handleClickShowUpdate, handleUpdate, handleChange, state, toggleShowUpdateMenuModal, setState } = useMenuMaker();

  // Prefill the form fields with the current menu item details
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      id,
      title,
      description,
      price,
    }));
  }, [id, title, description, price, setState]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-10 absolute top-0 left-0">
      <div className="bg-white p-4 rounded min-w-80 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-700">Update {title}</p>
          <button onClick={handleClickShowUpdate}>
            <IoMdClose className="text-xl text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        <div className="py-4">
          <form onSubmit={(e) => handleUpdate( id, e)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Menu Name
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={state.title}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={state.description}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 px-4 py-2 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={state.price}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

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
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuUpdate;
