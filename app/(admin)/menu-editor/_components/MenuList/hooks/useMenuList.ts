import { useEffect, useState } from "react";
import { fetchMenus, MenuItem } from "@/utils/fetchMenus";

export const useMenuList = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Default limit per page
  const [title, setTitle] = useState(""); // Filter title
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menus from API
  const getMenus = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenus(page, limit, title);
      setMenus(data.data); // Set menu items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenu = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this menu?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/menu/delete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete menu");

      alert("Menu deleted successfully!");
      getMenus(); // Refresh the menu list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting menu:", error);
      alert(error.message || "Error deleting menu.");
    }
  };

  // Fetch data when `page` or `title` changes
  useEffect(() => {
    getMenus();
  }, [page, title]);

  // Pagination handlers
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return {
    menus,
    isLoading,
    page,
    setPage,
    title,
    setTitle,
    handleNextPage,
    handlePrevPage,
    deleteMenu
  };
};
