import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle, Loader } from 'lucide-react';

export const AuthForm = ({ onSignIn, onSignUp, loading, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    const { error: authError } = isLogin
      ? await onSignIn(email, password)
      : await onSignUp(email, password);

    if (authError) {
      setFormError(authError);
    } else if (!isLogin) {
      setFormError('');
      setEmail('');
      setPassword('');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden lg:flex lg:min-h-[600px]">
          <div className="lg:w-1/2 relative">
            <img
              src="/img_9787.jpeg"
              alt="Couple"
              className="w-full h-64 lg:h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:via-black/10 lg:to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white lg:bottom-12 lg:left-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Strengthen Your Connection
              </h2>
              <p className="text-sm lg:text-base text-white/90">
                Navigate ADHD together with understanding and insight
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                ADHD Harmony Together
              </h1>
              <p className="text-slate-600 text-sm">
                Relationship Assessment Tool
              </p>
            </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {(formError || error) && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertCircle size={18} className="text-rose-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rose-700">{formError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Min 6 characters"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={20} />
                  Login
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

            {!isLogin && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  After creating your account, you'll be automatically logged in.
                </p>
              </div>
            )}

            <p className="text-center lg:text-left text-slate-500 text-xs mt-6">
              Your assessment data is securely stored and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
