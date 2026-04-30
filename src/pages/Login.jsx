import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthIcon = {
  Google: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.42Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96l3.35-2.58Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2 10 10 0 0 0 3.06 7.52l3.35 2.58C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
  ),
  Apple: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.74c-.03-2.67 2.18-3.95 2.28-4.02-1.24-1.82-3.18-2.07-3.87-2.1-1.65-.17-3.22.97-4.06.97-.84 0-2.14-.95-3.52-.92-1.81.03-3.48 1.05-4.41 2.67-1.88 3.26-.48 8.09 1.35 10.73.9 1.3 1.97 2.76 3.38 2.7 1.36-.05 1.87-.88 3.51-.88 1.64 0 2.1.88 3.54.85 1.46-.03 2.39-1.32 3.28-2.62 1.03-1.51 1.45-2.97 1.48-3.04-.03-.01-2.83-1.08-2.86-4.34ZM13.69 4.87c.75-.9 1.25-2.16 1.11-3.41-1.07.04-2.36.71-3.13 1.61-.69.8-1.29 2.08-1.13 3.3 1.19.09 2.4-.61 3.15-1.5Z" />
    </svg>
  ),
  Microsoft: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#f25022" d="M3 3h8.5v8.5H3z" />
      <path fill="#7fba00" d="M12.5 3H21v8.5h-8.5z" />
      <path fill="#00a4ef" d="M3 12.5h8.5V21H3z" />
      <path fill="#ffb900" d="M12.5 12.5H21V21h-8.5z" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 21V10a1 1 0 0 0-1-1h-3M8 8h2M8 12h2M8 16h2M13 8h1M13 12h1M13 16h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function AuthProviderButton({ icon, children }) {
  const ProviderIcon = icon;

  return (
    <button type="button" className="login-provider-btn">
      <ProviderIcon />
      <span>{children}</span>
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    navigate("/dashboard");
  };

  return (
    <main className="login-spread-page">
      <section className="login-hero-panel">
        <Link to="/" className="login-brand">
          <img src="/inovamap-logo.png" alt="InovaMap" />
          <span>
            <strong>InovaMap</strong>
            <small>Indoor Navigation Platform</small>
          </span>
        </Link>

        <div className="login-story">
          <p className="login-eyebrow">Indoor mapping workspace</p>
          <h1>Manage venues, floors, and routes from one calm workspace.</h1>
          <p>
            Sign in to update building maps, place destinations, connect routes,
            and prepare visitor-ready indoor navigation.
          </p>
        </div>

        <div className="login-feature-list">
          <article>
            <span><AuthIcon.Building /></span>
            <div>
              <h3>Venue-ready</h3>
              <p>Upload floor plans, add POIs, and preview routes before launch.</p>
            </div>
          </article>
          <article>
            <span><AuthIcon.Shield /></span>
            <div>
              <h3>Secure access</h3>
              <p>Keep map editing and publishing tools behind protected sign-in.</p>
            </div>
          </article>
        </div>

        <p className="login-footnote">Authenticated access for InovaMap administrators</p>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="login-card-header">
            <div>
              <h2>Sign in to InovaMap</h2>
              <p>Continue to your map editor, floor drafts, and route tools.</p>
            </div>
            <span>Secure sign-in</span>
          </div>

          <div className="login-provider-grid">
            <AuthProviderButton icon={AuthIcon.Google}>Continue with Google</AuthProviderButton>
            <AuthProviderButton icon={AuthIcon.Apple}>Continue with Apple</AuthProviderButton>
            <AuthProviderButton icon={AuthIcon.Microsoft}>Continue with Microsoft</AuthProviderButton>
            <AuthProviderButton icon={AuthIcon.Phone}>Continue with Phone Number</AuthProviderButton>
          </div>

          <div className="login-divider"><span>OR</span></div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email address
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your work email"
                required
              />
            </label>

            <label htmlFor="password">
              Password
              <span className="login-password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <AuthIcon.Eye />
                </button>
              </span>
            </label>

            <button type="submit" className="login-submit">
              Sign in <AuthIcon.Arrow />
            </button>
          </form>

          <div className="login-card-links">
            <button type="button">Forgot password?</button>
            <button type="button">Create account</button>
            <button type="button">First-time activation</button>
          </div>
        </div>
      </section>
    </main>
  );
}
