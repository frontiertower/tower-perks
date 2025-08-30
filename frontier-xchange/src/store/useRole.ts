import { useLocalStorage } from '@/hooks/useLocalStorage';

export type UserRole = 'NON_MEMBER' | 'MEMBER';

interface RoleData {
  role: UserRole;
  ids: {
    posterId: string;
    memberId: string;
  };
}

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

const defaultRoleData: RoleData = {
  role: 'NON_MEMBER',
  ids: {
    posterId: generateId('guest'),
    memberId: generateId('member'),
  },
};

export function useRole() {
  const [roleData, setRoleData] = useLocalStorage<RoleData>('user-role', defaultRoleData);

  const setRole = (role: UserRole) => {
    setRoleData(prev => ({ ...prev, role }));
  };

  const getCurrentId = () => {
    return roleData.role === 'NON_MEMBER' ? roleData.ids.posterId : roleData.ids.memberId;
  };

  return {
    role: roleData.role,
    posterId: roleData.ids.posterId,
    memberId: roleData.ids.memberId,
    currentId: getCurrentId(),
    setRole,
  };
}