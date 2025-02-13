import React, { useContext } from 'react';
import { Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const context = useContext(ThemeContext);
  
  // Verificamos si el contexto es undefined y lanzamos un error si es así
  if (!context) {
    throw new Error('ThemeToggleButton must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = context;
  console.log('Current theme:', theme);

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<BulbOutlined />}
      onClick={toggleTheme}
      className={`flex-grow-0 flex-shrink-0 ${theme === 'light' ? 'bg-blue-200 border-blue-200' : 'bg-gray-700 border-gray-700'}`}
    />
  );
};

export default ThemeToggleButton; 