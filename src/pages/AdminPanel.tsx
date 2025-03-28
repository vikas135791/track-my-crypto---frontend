import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Edit, Trash2, X } from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  lastLogin: string;
  lastLogout: string;
  password: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedPassword, setUpdatedPassword] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data); // ✅ Corrected from response.json()
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUpdatedName(user.name);
    setUpdatedPassword('');
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await axios.put(`${apiUrl}/users/${editingUser._id}`, {
        name: updatedName,
        password: updatedPassword,
      });

      setUsers((prevUsers) =>
          prevUsers.map((u) =>
              u._id === editingUser._id ? { ...u, name: updatedName } : u
          )
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${apiUrl}/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(
      (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
      <div className="min-h-screen bg-gray-900 mt-16 py-8 px-4 sm:px-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-3 w-96 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Stats Overview */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? 'Loading...' : users.length}
                </p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="mr-2" size={20} /> Registered Users
            </h2>
            <div className="space-y-3">
              {loading ? (
                  <p className="text-gray-400 text-center py-4">Loading...</p>
              ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((userItem) => (
                      <div
                          key={userItem._id}
                          className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-600 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium">{userItem.name}</p>
                          <p className="text-gray-400 text-sm">Email: {userItem.email}</p>
                          <p className="text-gray-400 text-sm">Last Login: {userItem.lastLogin}</p>
                          <p className="text-gray-400 text-sm">Last Logout: {userItem.lastLogout}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                              onClick={() => handleEdit(userItem)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            <Edit size={16} />
                          </button>
                          {userItem.role !== 'admin' && userItem._id !== user?._id && (
                              <button
                                  onClick={() => handleDelete(userItem._id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                          )}
                        </div>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-400 text-center py-4">No users found</p>
              )}
            </div>
          </div>
        </div>

        {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-gray-800 p-6 rounded-lg w-96 relative">
                <button
                    onClick={() => setEditingUser(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-semibold text-white mb-4">Edit User</h2>
                <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                    placeholder="Update Name"
                />
                <input
                    type="password"
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                    placeholder="Update Password"
                />
                <button
                    onClick={handleUpdate}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminPanel;
