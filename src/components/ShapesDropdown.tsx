import React, { useState, useEffect, useRef } from "react";
import { ShapeOption } from "./ShapeOption";

interface ShapesState {
  rectangles: boolean;
  ellipses: boolean;
  polygons: boolean;
  stars: boolean;
}

interface ShapesDropdownProps {
  shapes: ShapesState;
  onShapeChange: (shapeName: keyof ShapesState, checked: boolean) => void;
}

export function ShapesDropdown({ shapes, onShapeChange }: ShapesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Shape icons (SVG elements)
  const getRectangleIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="2"
        y="4"
        width="12"
        height="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  const getEllipseIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx="8"
        cy="8"
        rx="6"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  const getPolygonIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 8 3 L 12 5.5 L 12 10.5 L 8 13 L 4 10.5 L 4 5.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  const getStarIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 8 2 L 9.5 6 L 14 6.5 L 10.5 9.5 L 11.5 14 L 8 11.5 L 4.5 14 L 5.5 9.5 L 2 6.5 L 6.5 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  // Get selected shape icons for header
  const getSelectedIcons = () => {
    const icons = [];
    if (shapes.rectangles) icons.push(getRectangleIcon());
    if (shapes.ellipses) icons.push(getEllipseIcon());
    if (shapes.polygons) icons.push(getPolygonIcon());
    if (shapes.stars) icons.push(getStarIcon());
    return icons;
  };

  const selectedIcons = getSelectedIcons();

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
            {selectedIcons.map((icon, index) => (
              <div key={index} className="dropdown-header-icon">
                {icon}
              </div>
            ))}
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
          <ShapeOption
            id="RecChk"
            label="Rectangles"
            icon={getRectangleIcon()}
            checked={shapes.rectangles}
            onChange={(checked) => onShapeChange("rectangles", checked)}
          />
          <ShapeOption
            id="EllChk"
            label="Ellipses"
            icon={getEllipseIcon()}
            checked={shapes.ellipses}
            onChange={(checked) => onShapeChange("ellipses", checked)}
          />
          <ShapeOption
            id="PolyChk"
            label="Polygons"
            icon={getPolygonIcon()}
            checked={shapes.polygons}
            onChange={(checked) => onShapeChange("polygons", checked)}
          />
          <ShapeOption
            id="StarChk"
            label="Stars"
            icon={getStarIcon()}
            checked={shapes.stars}
            onChange={(checked) => onShapeChange("stars", checked)}
          />
        </div>
      </div>
    </div>
  );
}
