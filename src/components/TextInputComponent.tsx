import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

export interface TextInputProps {
  value: string;
  type?: string;
  handleTextChange: (arg0: string) => void;
  pattern?: string;
  handleValidate?: (arg0: string) => boolean;
}

export const TextInputComponent = ({
  handleTextChange,
  type = "text",
  value,
  pattern = "",
  handleValidate = (str: string) => true
}: TextInputProps) => {
  // const [hideInput, setHideInput] = useState(true);
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

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     setHideInput(true);
  //   }
  // };

//      <input
//        size={size}
//        style={{
//          display: hideInput ? "none" : "inline"
//        }}
//        pattern={pattern}
//        value={value}
//        onChange={event => {
//          if (handleValidate(event.currentTarget.value)) {
//            handleTextChange(event.currentTarget.value);
//          }
//        }}
//        onKeyPress={handleKeyPress}
//        onBlur={() => {
//          setHideInput(true);
//        }}
//      />

  return (
    <>
      <InputGroup>
        <Form.Control
          plaintext
          pattern={pattern}
          value={value}
          type={type}
          onChange={event => {
            if (handleValidate(event.currentTarget.value)) {
              handleTextChange(event.currentTarget.value);
            }
          }}
        />
      </InputGroup>
    </>
  );
};
