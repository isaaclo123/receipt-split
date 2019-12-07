import React from 'react'

import Badge from 'react-bootstrap/Badge';

import './BadgeListComponent.css'

export interface BadgeListProps {
  items: string[];
  handleItemClick: (index: number) => void;
  handleDeleteClick: (index: number) => void;
  handleAddClick: () => void;
}

export const BadgeListComponent = (props : BadgeListProps) => {
  const {
    items,
    handleItemClick,
    handleDeleteClick,
    handleAddClick
  } = props

  return (
    <>
      {items.map((item, index: number) => {
        return (
          <>
            <Badge
              className="item-badge"
              variant="primary"
              pill>
              <span
                onClick={() => handleItemClick(index)}>
                {item}
              </span>

              &nbsp;

              <span
                onClick={() => handleDeleteClick(index)}
                className="item-badge-delete">
                x
              </span>
            </Badge>
          </>
        )
      })}
      <Badge
        onClick={() => handleAddClick()}
        variant="primary"
        pill>
        +
      </Badge>
    </>
  )
}
