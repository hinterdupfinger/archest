'use client';

import { useEffect, useState } from 'react';
import { getUserAction } from '../../app/actions/userActions';
import { UserCard } from '../ui/UserCard';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    getUserAction(userId).then(setUser);
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile Feature</h1>
      <UserCard
        id={user.id}
        name={user.name}
        onActionClick={() => console.log('Action clicked for', user.id)}
      />
    </div>
  );
}
