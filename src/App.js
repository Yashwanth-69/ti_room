import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatRoom from "./Pages/ChatRoom";
import LoginPage from "./Pages/login";
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

  if (loading){
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
      <Route path="/login" element={(user) ? (<Navigate to="/chat" />):(<LoginPage/>)} />
      <Route path="/chat" element={(user) ? (<ChatRoom user={user} />):(<Navigate to="/login"/>)} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
