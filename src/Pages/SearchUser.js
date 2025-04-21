import React, { useState, useEffect } from 'react';
import { db } from '../database/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SearchUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-6 border border-blue-800">
          <h2 className="text-3xl font-bold text-white mb-6">Search Users</h2>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-blue-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-white text-center">Loading users...</div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center bg-gray-800 p-4 rounded-lg border border-blue-700 hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">{user.displayName}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-gray-400 text-center">No users found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchUsers;