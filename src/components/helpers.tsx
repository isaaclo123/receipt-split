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

// https://codewithstyle.info/Deep-property-access-in-TypeScript/

// START GET Function

export function get<
  T,
  P1 extends keyof NonNullable<T>
>(obj: T, prop1: P1): NonNullable<T>[P1] | undefined;

export function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>
>(obj: T, prop1: P1, prop2: P2): NonNullable<NonNullable<T>[P1]>[P2] | undefined;

export function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3): NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3] | undefined;

export function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>,
  P4 extends keyof NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>
  >(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4):NonNullable<NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3]>[P4] | undefined;

export function get(obj: any, ...props: string[]): any {
  return obj && props.reduce(
    (result, prop) => result == null ? undefined : result[prop],
    obj
  );
}

// END GET Function
