"use client";

import React, { useState } from "react";
import useTheme from "../../hooks/useTheme";
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

const ThemeToggleButton: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button 
      onClick={handleToggle} 
      className="p-2 bg-background rounded-full flex items-center justify-center"
    >
      {isDarkMode ? (
        <MoonOutlined className="h-5 w-5 text-primary" />
      ) : (
        <SunOutlined className="h-5 w-5 text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggleButton; 