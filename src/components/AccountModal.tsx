import React, { useState, useEffect } from 'react';
import { CustomerOrder, Product } from '../types';
import { X, User, LogOut, Check, ArrowLeft, Mail, Lock, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { MyAccountArea } from './MyAccountArea';
import { SignUpResult } from '../auth';

interface AccountModalProps {
  isOpen: boolean;
  pageMode?: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string } | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<SignUpResult>;
  onResetPassword: (email: string) => Promise<void>;
  onUpdatePassword?: (password: string) => Promise<{ name: string; email: string }>;
  onSignOut: () => void;
  pastOrders: CustomerOrder[];
  initialMode?: 'signin' | 'signup' | 'forgot' | 'update_password';
  products?: Product[];
  wishlistIds?: number[];
  onToggleWishlist?: (productId: number) => void;
  onAddToCart?: (product: Product, shade?: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  pageMode = false,
  onClose,
  currentUser,
  onSignIn,
  onSignUp,
  onResetPassword,
  onUpdatePassword,
  onSignOut,
  pastOrders,
  initialMode = 'signin',
  products = [],
  wishlistIds = [],
  onToggleWishlist = () => {},
  onAddToCart = () => {}
}) => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'update_password'>(initialMode);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      if (initialMode) setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !password) return;
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onSignIn(emailInput.trim(), password);
      setPassword('');
      onClose();
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : 'Could not access your account.';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMessage(
          'Email not confirmed yet. Please check your inbox (and spam folder) for the verification link sent by Supabase, then log in.'
        );
      } else if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Incorrect email address or password. Please check your credentials or reset your password.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !password) return;
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await onSignUp(nameInput.trim(), emailInput.trim(), password);
      if (res && !res.requiresEmailConfirmation) {
        setSuccessMessage(`Welcome, ${res.name}! Your account is active and you are now signed in.`);
        setPassword('');
        setTimeout(() => onClose(), 1200);
      } else {
        setSuccessMessage(
          `Account created successfully! Based on your Supabase configuration, an email confirmation link was sent to ${emailInput.trim()}. Please verify your email before signing in.`
        );
      }
    } catch (error: any) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onResetPassword(email);
      setSuccessMessage(
        `We've sent a password reset link to ${email}. Please check your inbox and spam folder, then follow the link to set your new password.`
      );
    } catch (error: any) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not send reset link. Please verify your email address.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!onUpdatePassword) {
      setErrorMessage('Password update is not available.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onUpdatePassword(password);
      setSuccessMessage('Your password has been successfully updated in Supabase! You are now signed in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMode('signin');
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={pageMode ? "flex justify-center w-full" : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"}>
      {/* If Signed In: Show MyAccountArea */}
      {currentUser ? (
        <div className={pageMode ? "relative w-full max-w-4xl" : "relative w-full max-w-4xl max-h-[92vh] overflow-y-auto"}>
          <MyAccountArea
            currentUser={currentUser}
            onSignOut={onSignOut}
            localOrders={pastOrders}
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onClose={pageMode ? undefined : onClose}
          />
        </div>
      ) : (
        /* If Signed Out: Auth Modal */
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center">
                {mode === 'forgot' ? (
                  <KeyRound className="w-4 h-4" />
                ) : mode === 'update_password' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
                  {mode === 'forgot'
                    ? 'Reset Your Password'
                    : mode === 'signup'
                    ? 'Create Your Account'
                    : mode === 'update_password'
                    ? 'Set New Password'
                    : 'Sign In to Bekky’s Touch'}
                </h2>
                <p className="text-[11px] text-stone-500">
                  {mode === 'signup'
                    ? 'Join for VIP perks & order tracking'
                    : mode === 'forgot'
                    ? 'We will send a recovery link'
                    : 'Access your profile & order history'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              hidden={pageMode}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your registered email address below. We will send a secure Supabase recovery link to reset your password.
              </p>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Reset Link Dispatched
                  </p>
                  <p>{successMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                    placeholder="name@example.com"
                    autoFocus
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Recovery Email</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-stone-600 hover:text-stone-900 font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          ) : mode === 'update_password' ? (
            /* UPDATE PASSWORD FORM */
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Create a new secure password for your Bekky’s Touch account.
              </p>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">New Password (min. 6 characters)</label>
                <div className="relative">
                  <input
                    type="password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                    placeholder="••••••••"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    minLength={6}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          ) : (
            /* SIGN IN / SIGN UP FORM */
            <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn} className="p-6 space-y-4">
              <p className="text-xs text-stone-600">
                {mode === 'signup'
                  ? 'Create an account to save shipping addresses, track orders, and curate your wishlist.'
                  : 'Sign in to access your profile, order history, and saved addresses.'}
              </p>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Success
                  </p>
                  <p>{successMessage}</p>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                      placeholder="e.g. Eleanor Vance"
                      autoFocus
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                    placeholder="name@example.com"
                    autoFocus={mode === 'signin'}
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-stone-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                {mode === 'signup' && (
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Must be at least 6 characters
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-[#1E1B18] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
              >
                {busy ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-stone-500">
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="font-semibold text-stone-900 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="font-semibold text-stone-900 hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
