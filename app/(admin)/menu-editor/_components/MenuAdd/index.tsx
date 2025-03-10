import React, { useEffect, useState } from 'react';
import { useMenuMaker } from '../../context/MenuMakerContext';
import { IoMdClose } from 'react-icons/io';

// Define types for the state structure
interface MenuCategory {
  id: number;
  title: string;
}

interface OrderType {
  id: number;
  name: string;
}

interface FormState {
  category: string;
  title: string;
  description: string;
  price: number;
  order_type: string;
  inventory_quantity: number;
  start_date: string;
}

const MenuAdd = () => {
  const { state, handleChange, toggleShowAddMenuModal, handleSubmit } = useMenuMaker();
  
  const [categories, setCategories] = useState<MenuCategory[]>([]); // State to hold category list
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]); // State to hold order types
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page in the stepper
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/categories`);
        if (response.ok) {
          const data: MenuCategory[] = await response.json();
          setCategories(data); // Assuming response contains an array of category objects
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrderTypes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/types`);
        if (response.ok) {
          const data: OrderType[] = await response.json();
          setOrderTypes(data); // Assuming response contains an array of order types
        } else {
          console.error('Failed to fetch order types');
        }
      } catch (error) {
        console.error('Error fetching order types:', error);
      }
    };

    if (currentPage === 2) {
      fetchOrderTypes();
    }
  }, [currentPage]);

  // Event handler for "Next" button click
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();  // Prevent form submission
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  };

  // Event handler for "Previous" button click
  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();  // Prevent form submission
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-10 absolute top-0 left-0">
      <div className="bg-white p-4 rounded min-w-80">
        <div className="flex items-bottom justify-between">
          <p className="font-bold text-gray-700">Add New Menu</p>
          <button onClick={toggleShowAddMenuModal}>
            <IoMdClose className="text-xl" />
          </button>
        </div>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentPage === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Menu Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={state.category}
                    onChange={handleChange}
                    className="mt-1 px-2 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Menu Name
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
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Menu Description
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
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={state.price}
                    onChange={handleChange}
                    className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="order_type" className="block text-sm font-medium text-gray-700">
                    Order Type
                  </label>
                  <select
                    id="order_type"
                    name="order_type"
                    value={state.order_type}
                    onChange={handleChange}
                    className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Order Type</option>
                    {orderTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="inventory_quantity" className="block text-sm font-medium text-gray-700">
                    Inventory Quantity
                  </label>
                  <input
                    type="number"
                    id="inventory_quantity"
                    name="inventory_quantity"
                    value={state.inventory_quantity}
                    onChange={handleChange}
                    className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={state.start_date}
                    onChange={handleChange}
                    className="mt-1 px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-500 bg-gray-300 font-semibold rounded-md shadow hover:bg-gray-600"
                >
                  Previous
                </button>
              )}
              {currentPage < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuAdd;
