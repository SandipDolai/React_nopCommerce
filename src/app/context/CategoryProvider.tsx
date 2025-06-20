import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from 'react';


interface CategoryContextType {
    activeCategory: string | null;
    setActiveCategory: Dispatch<SetStateAction<string | null>>;
    activeSubCategory: string | null;
    setActiveSubCategory: Dispatch<SetStateAction<string | null>>;
}


interface CategoryProviderProps {
    children: ReactNode;
}

const CategoryContext = createContext<CategoryContextType>({
    activeCategory: null,
    setActiveCategory: () => { },
    activeSubCategory: null,
    setActiveSubCategory: () => { },
});

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(() => {
        return localStorage.getItem('activeCategory');
    });
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(() => {
        return localStorage.getItem('activeSubCategory');
    });

    useEffect(() => {
        if (activeCategory !== null) {
            localStorage.setItem('activeCategory', activeCategory);
        }
    }, [activeCategory]);

    useEffect(() => {
        if (activeSubCategory !== null) {
            localStorage.setItem('activeSubCategory', activeSubCategory);
        }
    }, [activeSubCategory]);

    return (
        <CategoryContext.Provider value={{ activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};