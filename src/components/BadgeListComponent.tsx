import React from "react";

import Badge from "react-bootstrap/Badge";

import "./BadgeListComponent.css";

export interface BadgeListProps {
  items: string[];
  handleItemClick: (index: number) => void;
  handleDeleteClick: (index: number) => void;
  handleAddClick: () => void;
}

export const BadgeListComponent = (props: BadgeListProps) => {
  const { items, handleItemClick, handleDeleteClick, handleAddClick } = props;

  if (items && items.length) {
    return (
      <>
        {items.map((item, index: number) => {
          return (
            <>
              <Badge
                className="item-badge border-0"
                variant="primary"
                pill
                onClick={() => {
                  handleDeleteClick(index);
                }}
                as="button">
                <span onClick={() => handleItemClick(index)}>{item}</span>
                &nbsp;
                <span className="item-badge-delete">
                  &times;
                </span>
              </Badge>
            </>
          );
        })}
        <Badge onClick={() => handleAddClick()}
          variant="primary"
          className="border-0"
          pill
          as="button">
          +
        </Badge>
      </>
    );
  }

  return (
    <>
      <Badge
        className="item-badge"
        variant="secondary"
        pill>
        Nobody
      </Badge>
        <Badge onClick={() => handleAddClick()}
          variant="secondary"
          className="border-0"
          pill
          as="button">
        +
      </Badge>
    </>
  );
};
