import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification deve estar dentro do NotificationProvider");
  }
  return context;
}
