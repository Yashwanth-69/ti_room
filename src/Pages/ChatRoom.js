import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../database/firebase";
import {signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

function ChatRoom({user}) {
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);
  const dummy = useRef();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut(auth)
    navigate('/');
  };
  
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      dummy.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsubscribe();
  }, []);
  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (formValue.trim() === '') return;
    
    await addDoc(collection(db, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid
    });
    
    setFormValue("");
  };
  
  return (
    <div className="max-w-auto mx-auto px-[8em] py-[1.5%] min-h-screen bg-gradient-to-br from-black to-blue-900">
      <header className="bg-blue-900 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔥 Chat Room</h1>
        <button 
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </header>

      <section className="bg-white p-4 h-[calc(100vh-200px)] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 mb-4 ${
              msg.uid === user?.uid ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <img 
              src={msg.photoURL} 
              alt="avatar" 
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.uid === user?.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm mb-1">{msg.displayName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <span ref={dummy}></span>
      </section>

      {user && (
        <form onSubmit={sendMessage} className="bg-white p-4 rounded-b-lg border-t">
          <div className="flex gap-2">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>

  );
}

export default ChatRoom;