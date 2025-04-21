import React, { useState, useEffect } from 'react';
import { db } from '../database/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Chats({ user }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        let userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            friends: []
          });
          userDoc = await getDoc(userRef);
        }

        const userData = userDoc.data();
        const friendIds = userData?.friends || [];

        const friendsData = await Promise.all(
          friendIds.map(async (friendId) => {
            const friendDoc = await getDoc(doc(db, 'users', friendId));
            return { id: friendDoc.id, ...friendDoc.data() };
          })
        );

        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  const openChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  const goToSearch = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-6 border border-blue-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Chats</h2>
            <button
              onClick={goToSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Find Friends
            </button>
          </div>

          {loading ? (
            <div className="text-white text-center">Loading chats...</div>
          ) : friends.length > 0 ? (
            <div className="space-y-4">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  onClick={() => openChat(friend.id)}
                  className="flex items-center bg-gray-800 p-4 rounded-lg border border-blue-700 hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <img
                    src={friend.photoURL}
                    alt={friend.displayName}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">{friend.displayName}</h3>
                    <p className="text-gray-400 text-sm">{friend.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="mb-4">No friends yet</p>
              <button
                onClick={goToSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Find Friends
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
