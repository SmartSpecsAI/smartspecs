"use client";

import React from "react";
import useTheme from "../../hooks/useTheme";
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

const ThemeToggleButton: React.FC = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full flex items-center justify-center"
    >
      {theme === 'dark' ? (
        <MoonOutlined className="h-5 w-5 text-primary" />
      ) : (
        <SunOutlined className="h-5 w-5 text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggleButton; 