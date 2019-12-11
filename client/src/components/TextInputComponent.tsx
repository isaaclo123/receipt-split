import React, { useState } from 'react'

export interface TextInputProps {
  value: string;
  handleTextChange: (arg0: string) => void;
  pattern?: string;
  handleValidate?: (arg0: string) => boolean;
}

export const TextInputComponent = ({
    handleTextChange,
    value,
    pattern = "",
    handleValidate = (str: string) => true
  }: TextInputProps) => {

  const [ hideInput, setHideInput ] = useState(true)
  const [ newValue, setNewValue ] = useState(value)

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (handleValidate(newValue)) {
        handleTextChange(newValue)
        setHideInput(true)
      } else {
        setNewValue(value)
      }
    }
  }

  // if (hideInput &&
  //     value === "" &&
  //     props.placeholderText != null &&
  //     props.placeholderClass != null) {
  //   return (
  //     <span
  //       onClick={() => {hideInput = false; alert(hideInput.toString())}}
  //       className={props.placeholderClass}>
  //       {props.placeholderText}
  //     </span>
  //   )
  // }

  return (
    <>
      <span
        onClick={() => {setHideInput(false)}}
        style={{
          display: hideInput ? "inline" : "none"
        }}>
        {newValue}
      </span>

      <input
        style={{
          display: hideInput ? "none" : "inline"
        }}
        pattern={pattern}
        value={newValue}
        onChange={event => {setNewValue(event.currentTarget.value)}}
        onKeyPress={handleKeyPress} />
    </>
  )
}
