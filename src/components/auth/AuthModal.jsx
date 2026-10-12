import React, { useState } from 'react';
import { Leaf, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTelemetry } from '../../context/TelemetryContext.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authView,
    setAuthView,
    signIn,
    signUp,
    sendPasswordReset,
    isLoading,
    authError
  } = useAuth();

  const { addToast } = useTelemetry();

  // Form States
  const [signInEmail, setSignInEmail] = useState('admin@university.edu');
  const [signInPassword, setSignInPassword] = useState('password123');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(signInEmail, signInPassword);
      addToast('Authenticated successfully as Enterprise Manager', 'success');
    } catch {
      // Error handled via authError
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(signUpName, signUpEmail, signUpPassword);
      addToast('Enterprise account registered successfully', 'success');
    } catch {
      // Error handled via authError
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordReset(forgotEmail);
      addToast(`Password recovery link dispatched to ${forgotEmail}`, 'info');
      setAuthView('signin');
    } catch {
      // Error handled via authError
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="max-w-md"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-campus-container text-campus-bronze mb-3">
          <Leaf size={22} />
        </div>
        <h3 className="font-serif text-2xl font-bold text-campus-text">
          {authView === 'signin' && 'Sign In to CampusPulse'}
          {authView === 'signup' && 'Register Enterprise Profile'}
          {authView === 'forgot' && 'Reset Password'}
        </h3>
        <p className="text-xs text-campus-muted mt-1">
          Institutional Energy & Sustainability Telemetry
        </p>
      </div>

      {authError && (
        <div className="p-3 mb-4 rounded bg-rose-light border border-rose text-rose text-xs font-medium">
          {authError}
        </div>
      )}

      {/* View: Sign In */}
      {authView === 'signin' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            label="Institutional Email"
            type="email"
            required
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            placeholder="admin@university.edu"
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setAuthView('forgot')}
                className="text-xs text-campus-bronze hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-2"
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In'}
          </Button>

          <div className="mt-5 text-center text-xs text-campus-muted border-t border-campus-border pt-4">
            Do not have an enterprise account?{' '}
            <button
              type="button"
              onClick={() => setAuthView('signup')}
              className="text-campus-bronze font-semibold hover:underline"
            >
              Request Access
            </button>
          </div>
        </form>
      )}

      {/* View: Sign Up */}
      {authView === 'signup' && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={signUpName}
            onChange={(e) => setSignUpName(e.target.value)}
            placeholder="Dr. Sarah Jenkins"
          />

          <Input
            label="Institutional Email"
            type="email"
            required
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            placeholder="s.jenkins@campus.edu"
          />

          <Input
            label="Create Password"
            type="password"
            required
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Minimum 6 characters"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Registering...' : 'Create Enterprise Profile'}
          </Button>

          <div className="mt-5 text-center text-xs text-campus-muted border-t border-campus-border pt-4">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => setAuthView('signin')}
              className="text-campus-bronze font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {/* View: Forgot Password */}
      {authView === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <Input
            label="Institutional Email"
            type="email"
            required
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="admin@university.edu"
            helperText="We will send password reset instructions to this address."
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <div className="mt-5 text-center text-xs text-campus-muted border-t border-campus-border pt-4">
            Back to{' '}
            <button
              type="button"
              onClick={() => setAuthView('signin')}
              className="text-campus-bronze font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default AuthModal;
