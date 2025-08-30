import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'non-member' | 'member';

interface UserState {
  role: UserRole;
  userId: string;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      role: 'non-member',
      userId: '',
      setRole: (role: UserRole) => {
        const userId = role === 'member' 
          ? `member-${Math.random().toString(36).substr(2, 9)}`
          : `guest-${Math.random().toString(36).substr(2, 9)}`;
        set({ role, userId });
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ role: state.role, userId: state.userId }),
    }
  )
);

// Initialize userId if not set
const store = useUserStore.getState();
if (!store.userId) {
  store.setRole(store.role);
}