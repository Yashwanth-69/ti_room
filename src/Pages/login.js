import { auth, provider } from "../database/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-blue-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Chat Room</h2>
          <p className="text-gray-400 mb-8">Connect and chat with people around the world</p>
        </div>
        
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ease-in-out flex items-center justify-center space-x-3 border border-blue-700"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;