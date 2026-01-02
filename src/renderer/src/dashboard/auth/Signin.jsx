import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginApiMutation } from '../../store/apiServices/authApi';
import { login } from '../../store/user/userSlice';

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginApi, { isLoading, error }] = useLoginApiMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi({ email, password }).unwrap();

      dispatch(
        login({
          username: response.name,
          userId: response.userId,
          token: response.token,
          email: response.email,
          role: response.role,
        })
      );

      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-[#5B5B5B] transition-colors duration-300">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <img
            src="https://www.dropbox.com/scl/fi/x06lq503q564254zn5370/Main-logo.svg?rlkey=gn7njrmr1bcixpl3atgkobjaz&st=z281m6ar&raw=1"
            alt="logo"
            className="dark:brightness-90"
          />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-8 w-95 text-center transition-colors duration-300">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-100">Please Sign In to Continue.</h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-5 text-left">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">
                USER NAME/EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">PASSWORD</label>

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full bg-[#5B5B5B] text-white dark:bg-gray-100 dark:text-[#1A1A1A] py-2 rounded-full text-sm font-medium hover:bg-[#5B5B5B]/90 dark:hover:bg-gray-200 transition"
            >
              {isLoading ? 'Signing in...' : 'Sign in With Email'}
            </button>
          </form>

          {error && (
            <p className="text-center text-red-500 mt-3">{error?.data?.message || 'Invalid login credentials'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
