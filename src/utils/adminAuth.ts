
import { UserRole } from "@/types";

export const isAdminUser = (userRole?: string) => {
  console.log('isAdminUser - Checking role:', userRole, 'Against:', UserRole.ADMIN);
  return userRole === UserRole.ADMIN;
};

export const redirectIfNotAdmin = (user: any, isLoading: boolean, navigate: any) => {
  console.log('redirectIfNotAdmin - User:', user, 'Loading:', isLoading);
  
  if (!user && !isLoading) {
    console.log('redirectIfNotAdmin - No user, redirecting to login');
    navigate('/admin/login');
    return true;
  }
  
  if (user && !isAdminUser(user.role)) {
    console.log('redirectIfNotAdmin - User exists but not admin, redirecting to home');
    navigate('/');
    return true;
  }
  
  return false;
};
