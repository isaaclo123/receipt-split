export * from "./consts";

export * from "./balance";
export * from "./login";
export * from "./payment";
export * from "./reciept";
export * from "./signup";
export * from "./user";

export interface ButtonProps {
  variant: string;
  text: string;
  handleClick: () => void;
}
