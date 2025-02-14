"use client";

import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider; 