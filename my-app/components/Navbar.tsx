'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and App Name */}
        <div className="flex items-center gap-3 ml-8">
          <h1 className="text-xl font-bold">
            Friend<span className="text-gray-500">loop</span>
          </h1>
        </div>

        {/* Right side - Create Event Button and User Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Create Event Button */}
              <button className="btn btn-primary rounded-full px-6 py-2 bg-blue-300 hover:bg-blue-400 transition-colors">
                + Create Event
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors group relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="font-medium">{user.email?.split('@')[0] || 'User'}</span>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Sign In Button for non-authenticated users */
            <Link href="/auth/login">
              <button className="rounded-full px-6 py-2 bg-blue-300 hover:bg-blue-400 transition-colors">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}