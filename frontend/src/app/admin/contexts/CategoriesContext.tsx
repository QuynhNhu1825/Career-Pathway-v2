import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "./AuthContext";

export interface Category {
  id: string;
  tenNganh: string;
  truong: string;
  diemChuan: string;
  link: string;
  nam: string;
  xuHuong: string;
}

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  activeCategories: Category[];
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { isAuthenticated } = useAuth();

  const refreshCategories = async () => {
    try {
      const res = await apiRequest("/admin/categories");
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (e) {
      console.error("Refresh categories error:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCategories();
    } else {
      setCategories([]);
    }
  }, [isAuthenticated]);

  const activeCategories = categories;

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        activeCategories,
        refreshCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories must be used inside CategoriesProvider");
  }

  return context;
}