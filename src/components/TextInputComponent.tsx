import React, { useState } from "react";

export interface TextInputProps {
  value: string;
  type?: string;
  handleTextChange: (arg0: string) => void;
  pattern?: string;
  size?: number;
  handleValidate?: (arg0: string) => boolean;
}

export const TextInputComponent = ({
  handleTextChange,
  size = 30,
  type = "text",
  value,
  pattern = "",
  handleValidate = (str: string) => true
}: TextInputProps) => {
  const [hideInput, setHideInput] = useState(true);
  // const [ newValue, setNewValue ] = useState(value)

  // if (value !== newValue) {
  //   setNewValue(value)
  //   // setHideInput(true)
  // }

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("keyparess");
    if (event.key === "Enter") {
      setHideInput(true);
    }
  };

  return (
    <>
      <span
        onClick={() => {
          setHideInput(false);
        }}
        style={{
          display: hideInput ? "inline" : "none"
        }}
      >
        {value}
      </span>

      <input
        size={size}
        style={{
          display: hideInput ? "none" : "inline"
        }}
        pattern={pattern}
        value={value}
        onChange={event => {
          if (handleValidate(event.currentTarget.value)) {
            handleTextChange(event.currentTarget.value);
          }
        }}
        onKeyPress={handleKeyPress}
        onBlur={() => {
          setHideInput(true);
        }}
      />
    </>
  );
};
