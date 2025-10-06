'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { colors } = useTheme();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    if (isAdmin) {
      fetchApiKeys();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!session) {
      setCheckingAdmin(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/check');
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/admin/api-keys');
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (res.ok) {
        const newKey = await res.json();
        setApiKeys([newKey, ...apiKeys]);
        setShowKey(newKey.key);
        setNewKeyName('');
      } else {
        alert('Failed to create API key');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      alert('Error creating API key');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (res.ok) {
        fetchApiKeys();
      } else {
        alert('Failed to update API key');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/api-keys?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
      } else {
        alert('Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Access Denied
          </h1>
          <p style={{ color: colors.text.secondary }} className="mb-4">
            You must be an admin to access this page.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text.primary }}>
            API Keys Management
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Manage API keys for leaderboard capture tool
          </p>
        </div>

        {/* New Key Alert */}
        {showKey && (
          <div className="mb-6 p-6 rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">API Key Created Successfully!</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white dark:bg-gray-900 px-4 py-2 rounded font-mono text-sm border border-green-300 dark:border-green-700 break-all">
                    {showKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(showKey)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowKey(null)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Create New Key */}
        <div className="mb-8 p-6 rounded-xl border-2" style={{
          backgroundColor: colors.surface,
          borderColor: colors.border.primary
        }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Create New API Key
          </h2>
          <form onSubmit={handleCreateKey} className="flex gap-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., 'Leaderboard Capture Bot')"
              className="flex-1 px-4 py-2 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border.primary,
                color: colors.text.primary
              }}
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create API Key'}
            </button>
          </form>
        </div>

        {/* API Keys List */}
        <div className="rounded-xl border-2 overflow-hidden" style={{
          backgroundColor: colors.surface,
          borderColor: colors.border.primary
        }}>
          <div className="p-6 border-b-2" style={{ borderColor: colors.border.primary }}>
            <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              API Keys ({apiKeys.length})
            </h2>
          </div>

          {apiKeys.length === 0 ? (
            <div className="p-12 text-center" style={{ color: colors.text.secondary }}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <p className="text-lg">No API keys created yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: colors.border.primary }}>
              {apiKeys.map((key) => (
                <div key={key.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text.primary }}>
                          {key.name}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          key.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm space-y-1" style={{ color: colors.text.secondary }}>
                        <p>
                          <span className="font-medium">Created:</span>{' '}
                          {new Date(key.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {key.lastUsedAt && (
                          <p>
                            <span className="font-medium">Last used:</span>{' '}
                            {new Date(key.lastUsedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                        <p className="font-mono text-xs mt-2 break-all">
                          {key.key.substring(0, 20)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(key.id, key.isActive)}
                        className={`px-4 py-2 rounded-lg transition font-semibold text-sm ${
                          key.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50'
                            : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                        }`}
                      >
                        {key.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
