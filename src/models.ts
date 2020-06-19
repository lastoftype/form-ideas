export enum USER_TYPE {
  driver = "driver",
  customer = "customer",
}

export interface IUser {
  firstName: string;
  lastName: string;
  email?: string;
  userType: USER_TYPE | null;
}

export interface ITrucker {
  user: IUser;
  id?: string;
}
