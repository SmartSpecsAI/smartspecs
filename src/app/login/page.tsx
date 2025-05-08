"use client";

import { useState, FormEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../app-lib/redux/slices/UsersSlice';
import { RootState, AppDispatch } from '../../app-lib/redux/store';
import { toast } from 'react-toastify';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { currentUser, isLoading, error } = useSelector((state: RootState) => state.users);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (currentUser) {
      // Mostrar notificación de éxito
      // toast.success('Inicio de sesión exitoso', {
      //   position: "top-right",
      //   autoClose: 1500,
      // });
      
      // Obtener la URL de retorno o usar la ruta predeterminada
      const returnUrl = searchParams.get('returnUrl') || '/projects';
      
      // Redirigir al usuario inmediatamente
      router.push(returnUrl);
    }
  }, [currentUser, router, searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Iniciar sesión con Firebase
      await dispatch(loginUser({ email, password })).unwrap();
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      // toast.error('Error al iniciar sesión', {
      //   position: "top-right",
      // });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to SmartSpecs</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded">{error}</div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <p>Don't have an account? <Link href="/register" className="text-blue-600 hover:text-blue-800">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
} 