import { UserType } from "../types/index";

export const listDiff = <T extends {}>(
  list1: T[],
  list2: T[],
  cmp: (arg0: T, arg1: T) => boolean
) => {
  return list1.filter(i => {
    for (let j = 0; j < list2.length; j++) {
      if (cmp(i, list2[j])) {
        return false;
      }
    }
    return true;
  });
};

export const userListDiff = (l1: UserType[], l2: UserType[]) =>
  listDiff<UserType>(l1, l2, (u1: UserType, u2: UserType) => u1.id === u2.id);
