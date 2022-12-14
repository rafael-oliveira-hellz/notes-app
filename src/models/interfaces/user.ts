export interface IUser {
  id: string;
  role: string;
  name: string;
  email: string;
  password: string;
  email_verified_at?: Date;
  password_reset_token?: string;
  remember_token?: string;
  provider_name?: string;
  provider_id?: string;
  profile_picture?: string;
  status: 'active' | 'inactive';
  lastLoginDate?: Date;
  currentLoginDate?: Date;
  created_at?: Date;
  updated_at?: Date;
}
