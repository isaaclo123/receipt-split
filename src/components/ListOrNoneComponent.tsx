import React from "react";

export type ListOrNoneComponentProps<T> = {
  list: T[];
  listComponent: (arg0: T, arg1?: number) => React.ReactNode;
  noneComponent?: React.ReactNode;
};

export const ListOrNoneComponent = <T extends {}>({
  list,
  listComponent,
  noneComponent = <></>
}: ListOrNoneComponentProps<T>) => {
  if (list == null || list.length <= 0) {
    return <> {noneComponent} </>;
  }

  return (
    <>
      {list.map((item: T, i: number) => {
        return <> {listComponent(item, i)} </>;
      })}
    </>
  );
};
