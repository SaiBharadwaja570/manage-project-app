// src/hooks/useUsers.js
import { useEffect, useState } from 'react';
import { getProjectMembers } from '../services/projectService';

export function useUsers(projectId) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const members = await getProjectMembers(projectId);
        setUsers(members);
      } catch (err) {
        console.error('Failed to fetch project members:', err);
        setError(err.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [projectId]);

  return { users, loading, error };
}

// Note: The separate export statement isn't needed since we're using
// named export directly in the function declaration