import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";

// Define the shape of the context
interface MenuState {
  menu_category_id: string;
  title: string;
  description: string;
  price: number;
}

interface MenuMakerContextProps {
  state: MenuState;
  setState: React.Dispatch<React.SetStateAction<MenuState>>;
  showAddMenu: boolean;
  showUpdateMenuModal: boolean;
  showUploadMenuModal: boolean; // ✅ Upload modal state
  toggleShowAddMenuModal: () => void;
  toggleShowUpdateMenuModal: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleClickShowUpdate: () => void;
  handleClickShowUpload: () => void; // ✅ New function for upload modal
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleUpdate: (id: string, e: FormEvent<HTMLFormElement>) => void;
}

// Create the context
const MenuMakerContext = createContext<MenuMakerContextProps | undefined>(
  undefined
);

// Provider component
export const MenuMakerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<MenuState>({
    menu_category_id: "",
    title: "",
    description: "",
    price: 0,
  });

  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [showUpdateMenuModal, setShowUpdateMenuModal] =
    useState<boolean>(false);
  const [showUploadMenuModal, setShowUploadMenuModal] =
    useState<boolean>(false); // ✅ Upload modal state

  const toggleShowAddMenuModal = () => {
    setShowAddMenu((prev) => !prev);
  };

  const toggleShowUpdateMenuModal = () => {
    setShowUpdateMenuModal((prev) => !prev);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        await response.json();
        alert("Menu added successfully!");
        toggleShowAddMenuModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to submit menu:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleUpdate = async (
    id: string,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: state.title, price: state.price, description: state.description }),
      });

      if (response.ok) {
        const updatedMenu = await response.json();
        
        alert(`Menu updated successfully: ${updatedMenu.data.title}`);
        setShowUpdateMenuModal(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to update menu:", error);
      alert("An unexpected error occurred.");
    } finally {
      setState({ menu_category_id: "", title: "", description: "", price: 0 });
      window.location.reload();
    }
  };

  const handleClickShowUpdate = () => {
    if (showUpdateMenuModal) {
      // If toggling off, reset the state to default values
      setState({ menu_category_id: "", title: "", description: "", price: 0 });
    } else {
      // If toggling on, prefill the form with the current card's values
      setState((prevState) => ({
        menu_category_id: prevState.menu_category_id,
        title: prevState.title,
        description: prevState.description,
        price: prevState.price,
      }));
    }
    setShowUpdateMenuModal(!showUpdateMenuModal); // Toggle the state
  };

  const handleClickShowUpload = () => {
    setShowUploadMenuModal((prev) => !prev);
  };

  return (
    <MenuMakerContext.Provider
      value={{
        state,
        setState,
        showAddMenu,
        showUpdateMenuModal,
        showUploadMenuModal,
        toggleShowAddMenuModal,
        toggleShowUpdateMenuModal,
        handleClickShowUpdate,
        handleClickShowUpload,
        handleChange,
        handleSubmit,
        handleUpdate,
      }}
    >
      {children}
    </MenuMakerContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMenuMaker = (): MenuMakerContextProps => {
  const context = useContext(MenuMakerContext);
  if (!context) {
    throw new Error("useMenuMaker must be used within a MenuMakerProvider");
  }
  return context;
};
