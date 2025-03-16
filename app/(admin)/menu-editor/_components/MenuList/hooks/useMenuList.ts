/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { fetchMenus, MenuItem } from "@/utils/fetchMenus";

export const useMenuList = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Default limit per page
  const [title, setTitle] = useState(""); // Filter title
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Wrap `getMenus` in `useCallback` to prevent re-creation
  const getMenus = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenus(page, limit, title);
      setMenus(data.data); // Set menu items
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, title]); // ✅ Dependencies to trigger re-fetch

  const deleteMenu = async (id: string) => {
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
      getMenus(); // ✅ No warning because `getMenus` is now stable
    } catch (error: any) {
      console.error("Error deleting menu:", error);
      alert(error.message || "Error deleting menu.");
    }
  };

  // ✅ Now `useEffect` won't complain because `getMenus` is stable
  useEffect(() => {
    getMenus();
  }, [getMenus]);

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
