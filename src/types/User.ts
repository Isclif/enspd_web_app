export type UserRole = 'admin' | 'professor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
