"use client";
import { ReactNode } from "react";
import { Provider } from 'react-redux';
import store from '@/smartspecs/lib/presentation/store/store';
import { AppLayout } from "@/smartspecs/lib/presentation";

type ClientProviderProps = {
  children: ReactNode;
};

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <Provider store={store}>
      <AppLayout>{children}</AppLayout>
    </Provider>
  );
}