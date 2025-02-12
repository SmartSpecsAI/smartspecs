"use client";
import React, { ReactNode } from "react";
import { Avatar, Input } from "antd";
import {
  CaretDownFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useDropdown } from "../../hooks/useDropdown";

export interface DropdownItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  selectedItem?: DropdownItem | null;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  onSelect,
  selectedItem,
}) => {
  const {
    isOpen,
    setIsOpen,
    searchText,
    setSearchText,
    dropdownRef,
    filteredItems,
  } = useDropdown(items, onSelect, selectedItem);

  return (
    <div
      ref={dropdownRef}
      className="d-inline-block me-3 py-1 px-2 dropdown"
      style={{ background: "#fff", borderRadius: "60px" }}
    >
      <a
        className={`dropdown-project-toggle dropdown-toggle flex gap-2 items-center px-1 ${
          isOpen ? "show" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedItem && selectedItem.label}
        <CaretDownFilled style={{ fontSize: "12px" }} size={2} />
      </a>

      {isOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: "absolute",
          }}
        >
          <div
            className="project-search-bar dropdown-item"
            style={{ zIndex: 99 }}
          >
            <Input
              prefix={<SearchOutlined />}
              suffix={
                searchText ? (
                  <CloseCircleFilled onClick={() => setSearchText("")} />
                ) : null
              }
              placeholder="Search Client"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-0"
              style={{ fontSize: "1rem", color: "#94979b", boxShadow: "none" }}
            />
          </div>

          {filteredItems.map((item: DropdownItem) => (
            <a
              key={item.value}
              className={`d-flex align-items-center fw-normal dropdown-item ${
                item.value == selectedItem?.value ? "active" : ""
              }`}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.icon && (
                <Avatar
                  src={item.icon}
                  style={{
                    width: 32,
                    height: 32,
                    lineHeight: "32px",
                    fontSize: 18,
                  }}
                />
              )}

              <span className="d-inline-block text-truncate align-middle ms-2">
                {item.label}
              </span>

              {item.value == selectedItem?.value && (
                <span className="ps-3 ms-auto">
                  <CheckCircleOutlined />
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
