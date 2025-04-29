import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/Layout/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Email is required');
      return;
    }

    if (!password) {
      setFormError('Password is required');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  // For demo purposes, provide login shortcuts
  const demoUsers = [
    { role: 'Patient', email: 'john@example.com', password: 'password' },
    { role: 'Doctor', email: 'sarah@example.com', password: 'password' },
    { role: 'Admin', email: 'admin@example.com', password: 'password' },
  ];

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const success = await login(demoEmail, demoPassword);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Healthcare Records Management System"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {(formError || error) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {formError || error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          fullWidth
        />

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          fullWidth
        />

        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {demoUsers.map((user) => (
            <div key={user.role} className="p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.role}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(user.email, user.password)}
                  disabled={isLoading}
                >
                  Login as {user.role}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;