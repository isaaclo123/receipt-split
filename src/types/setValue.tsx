export type setValuePayload<T> = {
  successType: string;
  failType?: string | null;
  validate?: (payload: T) => boolean;
  onSuccess?: (a: any, b:any) => any;
  onFail?: (a: any, b:any) => any;
};
