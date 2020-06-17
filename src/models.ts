export interface IUser {
  firstName: string;
  lastName: string;
}

export interface ITrucker {
  user: IUser;
  id?: string;
}
