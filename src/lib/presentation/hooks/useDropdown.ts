import { useState, useEffect, useRef } from "react";

export const useDropdown = (items: any, onSelect: any, selectedItem: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = items.filter((item: any) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    isOpen,
    setIsOpen,
    searchText,
    setSearchText,
    dropdownRef,
    filteredItems,
  };
}; 