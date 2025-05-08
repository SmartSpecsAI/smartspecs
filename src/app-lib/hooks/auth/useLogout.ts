import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser, logoutUserFromFirebase } from '@/smartspecs/app-lib/redux/slices/UsersSlice';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      // Sign out from Firebase
      await logoutUserFromFirebase();
      
      // Update Redux state
      dispatch(logoutUser());
      
      // Redirect to login
      router.push('/login');
      
      // Show success message
      toast.success('Sesión cerrada exitosamente', {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión', {
        position: "top-right",
      });
    }
  }, [dispatch, router]);

  return { logout };
}; 