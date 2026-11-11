import React, { useState, useEffect, useRef } from "react";
import { ShapeOption } from "./ShapeOption";
import type { ShapesState } from "../types";

interface ShapesDropdownProps {
  shapes: ShapesState;
  onShapeChange: (shapeName: keyof ShapesState, checked: boolean) => void;
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
};

const SHAPE_OPTIONS: {
  key: keyof ShapesState;
  id: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "rectangles",
    id: "RecChk",
    label: "Rectangles",
    icon: (
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="12" height="8" {...iconProps} />
      </svg>
    ),
  },
  {
    key: "ellipses",
    id: "EllChk",
    label: "Ellipses",
    icon: (
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="8" cy="8" rx="6" ry="4" {...iconProps} />
      </svg>
    ),
  },
  {
    key: "polygons",
    id: "PolyChk",
    label: "Polygons",
    icon: (
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 3 L 12 5.5 L 12 10.5 L 8 13 L 4 10.5 L 4 5.5 Z"
          {...iconProps}
        />
      </svg>
    ),
  },
  {
    key: "stars",
    id: "StarChk",
    label: "Stars",
    icon: (
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 2 L 9.5 6 L 14 6.5 L 10.5 9.5 L 11.5 14 L 8 11.5 L 4.5 14 L 5.5 9.5 L 2 6.5 L 6.5 6 Z"
          {...iconProps}
        />
      </svg>
    ),
  },
];

export function ShapesDropdown({ shapes, onShapeChange }: ShapesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const selectedOptions = SHAPE_OPTIONS.filter((option) => shapes[option.key]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        className={`dropdown-header ${isOpen ? "active" : ""}`}
        id="confettiDropdownHeader"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <div className="dropdown-header-left">
          <span>SHAPES</span>
        </div>
        <div className="dropdown-header-right">
          <div className="dropdown-header-icons" id="selectedIconsContainer">
            {selectedOptions.length === 0 ? (
              <span className="dropdown-header-empty">None selected</span>
            ) : (
              selectedOptions.map((option) => (
                <div key={option.key} className="dropdown-header-icon">
                  {option.icon}
                </div>
              ))
            )}
          </div>
          <span className="dropdown-chevron">
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
            >
              <path
                d="M 4 6 L 8 10 L 12 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <div
        className={`dropdown-panel ${isOpen ? "open" : ""}`}
        id="confettiDropdownPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dropdown-options">
          {SHAPE_OPTIONS.map((option) => (
            <ShapeOption
              key={option.key}
              id={option.id}
              label={option.label}
              icon={option.icon}
              checked={shapes[option.key]}
              onChange={(checked) => onShapeChange(option.key, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
