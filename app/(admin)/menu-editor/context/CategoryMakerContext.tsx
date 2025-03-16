import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";

// Define the shape of the context
interface CategoryState {
  title: string;
  description: string;
}

interface CategoryMakerContextProps {
  state: CategoryState;
  setState: React.Dispatch<React.SetStateAction<CategoryState>>;
  showAddCategory: boolean;
  showUpdateCategoryModal: boolean;
  toggleShowAddCategoryModal: () => void;
  toggleShowUpdateCategoryModal: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleClickShowUpdate: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleUpdate: (id: number, e: FormEvent<HTMLFormElement>) => void;
}

// Create the context
const CategoryMakerContext = createContext<
  CategoryMakerContextProps | undefined
>(undefined);

// Provider component
export const CategoryMakerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CategoryState>({
    title: "",
    description: "",
  });

  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<boolean>(false);

  const toggleShowAddCategoryModal = () => {
    setShowAddCategory((prev) => !prev);
  };

  const toggleShowUpdateCategoryModal = () => {
    setShowUpdateCategoryModal((prev) => !prev);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: type === "number" ? +value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        await response.json();
        alert("Category added successfully!");
        toggleShowAddCategoryModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to submit Category:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleUpdate = async (
    id: number,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/Category/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: state.title,
          description: state.description,
        }),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        alert(`Category updated successfully: ${updatedCategory.title}`);
        setShowUpdateCategoryModal(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to update Category:", error);
      alert("An unexpected error occurred.");
    } finally {
      setState({ title: "", description: "" });
    }
  };

  const handleClickShowUpdate = () => {
    if (showUpdateCategoryModal) {
      // If toggling off, reset the state to default values
      setState({ title: "", description: "" });
    } else {
      // If toggling on, prefill the form with the current card's values
      setState((prevState) => ({
        title: prevState.title,
        description: prevState.description,
      }));
    }
    setShowUpdateCategoryModal(!showUpdateCategoryModal); // Toggle the state
  };

  return (
    <CategoryMakerContext.Provider
      value={{
        state,
        setState,
        showAddCategory,
        showUpdateCategoryModal,
        toggleShowAddCategoryModal,
        toggleShowUpdateCategoryModal,
        handleClickShowUpdate,
        handleChange,
        handleSubmit,
        handleUpdate,
      }}
    >
      {children}
    </CategoryMakerContext.Provider>
  );
};

// Custom hook for consuming the context
export const useCategoryMaker = (): CategoryMakerContextProps => {
  const context = useContext(CategoryMakerContext);
  if (!context) {
    throw new Error(
      "useCategoryMaker must be used within a CategoryMakerProvider"
    );
  }
  return context;
};
