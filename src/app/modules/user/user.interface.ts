export enum Role {
  RIDER = "rider",
  DRIVER = "driver",
  ADMIN = "admin",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  isApproved?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
 
}
