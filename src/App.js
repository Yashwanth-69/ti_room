import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatRoom from "./Pages/ChatRoom";
import SigninPage from "./Pages/SignIn";
import SearchUsers from "./Pages/SearchUser";
import Chats from "./Pages/Chats";
import { auth } from "./database/firebase";
import ErrorPage from './Pages/error404'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <DotLottieReact
        src="https://lottie.host/d138c7f3-05cf-4670-8a9e-ef66d1824dfd/jAU9Fgxc81.lottie"
        loop
        autoplay
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={(user) ? (<Navigate to="/chats" />):(<SigninPage/>)} />
      <Route path="/chat" element={(user) ? (<ChatRoom user={user} />):(<Navigate to="/"/>)} />
      <Route path="/search" element={(user) ? (<SearchUsers />):(<Navigate to="/"/>)} />
      <Route path="/chats" element={(user) ? (<Chats user={user} />):(<Navigate to="/"/>)} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;