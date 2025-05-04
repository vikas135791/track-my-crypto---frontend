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
  bookmarks?: any[];
}

const AdminPanel: React.FC = () => {
  const { user }: any = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedPassword, setUpdatedPassword] = useState<string>('');
  const [editingUserBookmarks, setEditingUserBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = async (user: User) => {
    setEditingUser(user);
    setUpdatedName(user.name);
    setUpdatedPassword('');

    try {
      const res = await axios.get(`${apiUrl}/bookmarks/${user.email}`);
      setEditingUserBookmarks(res.data.bookmarks || []);
    } catch (err) {
      console.error("Error loading bookmarks", err);
    }
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
      setEditingUserBookmarks([]);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRemoveBookmark = async (cryptoId: string) => {
    if (!editingUser) return;
  
    try {
      await axios.delete(`${apiUrl}/bookmark`, {
        data: { email: editingUser.email, cryptoId },
      });
  
      // Update popup list
      const updatedBookmarks = editingUserBookmarks.filter((item) => item.id !== cryptoId);
      setEditingUserBookmarks(updatedBookmarks);
  
      // Update main user list (users[])
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id
            ? { ...user, bookmarks: updatedBookmarks }
            : user
        )
      );
    } catch (err) {
      console.error("Error removing bookmark", err);
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
                    {/* Show Bookmarks if available */}
                    {userItem.bookmarks && userItem.bookmarks.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-300 text-sm font-semibold">Bookmarks:</p>
                        <ul className="list-disc ml-5 text-gray-400 text-sm max-h-auto">
                          {userItem.bookmarks.map((bm: any) => (
                            <li key={bm.id}>{bm.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => {
                setEditingUser(null);
                setEditingUserBookmarks([]);
              }}
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
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
            >
              Save Changes
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Bookmarks</h3>
            {editingUserBookmarks.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookmarks available.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {editingUserBookmarks.map((bookmark) => (
                  <li
                    key={bookmark.id}
                    className="flex justify-between items-center text-sm bg-gray-700 p-2 rounded"
                  >
                    <span className='text-white'>{bookmark.name}</span>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className="text-red-400 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;