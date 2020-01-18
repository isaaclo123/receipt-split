export type setValuePayload<T> = {
  successType: string;
  failType?: string | null;
  validate?: (payload: T) => boolean;
};
