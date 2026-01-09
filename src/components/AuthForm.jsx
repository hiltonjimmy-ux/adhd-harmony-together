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
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
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
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Your assessment data is securely stored and private.
        </p>
      </div>
    </div>
  );
};
