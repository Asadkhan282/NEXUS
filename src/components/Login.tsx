import React from 'react';
import { motion } from 'motion/react';
import { Cpu, LogIn, Mail, Github, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexus-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexus-purple/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[40px] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-nexus-accent flex items-center justify-center neon-glow mb-6">
            <Cpu className="w-10 h-10 text-nexus-bg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">NEXUS CORE</h1>
          <p className="text-nexus-text-dim">Initialize neural link to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!showEmailForm ? (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-4 px-6 rounded-2xl bg-white text-nexus-bg font-bold flex items-center justify-center gap-3 hover:bg-nexus-accent transition-all group disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-nexus-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                  </>
                )}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-nexus-text-dim font-bold">Secure Access</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                <Mail className="w-5 h-5 text-nexus-text-dim" />
                Email Access
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-nexus-accent outline-none transition-all"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-nexus-accent outline-none transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-nexus-accent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 px-6 rounded-2xl bg-nexus-accent text-nexus-bg font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-nexus-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[10px] text-nexus-accent uppercase tracking-widest font-bold hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-bold hover:text-white"
                >
                  Back to Google Login
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-10 text-center text-[10px] text-nexus-text-dim uppercase tracking-widest leading-relaxed">
          By accessing NEXUS, you agree to our <br />
          <span className="text-nexus-accent cursor-pointer hover:underline">Neural Protocols</span> & <span className="text-nexus-accent cursor-pointer hover:underline">Data Sovereignty</span>
        </p>
      </motion.div>
    </div>
  );
}
