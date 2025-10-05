'use client';

import { useState, useEffect } from 'react';

interface UserProfile {
  displayTitle?: string;
  nameEffect?: string;
  customColor?: string;
}

interface UserDisplayProps {
  userId: string;
  userName: string;
  showTitle?: boolean;
}

export default function UserDisplay({ userId, userName, showTitle = true }: UserDisplayProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getNameStyle = () => {
    const style: React.CSSProperties = {};

    if (profile?.customColor) {
      style.color = profile.customColor;
    }

    if (profile?.nameEffect === 'glow') {
      style.textShadow = `0 0 10px ${profile.customColor || '#f2721b'}, 0 0 20px ${profile.customColor || '#f2721b'}`;
    } else if (profile?.nameEffect === 'pulse') {
      style.animation = 'pulse 2s infinite';
    } else if (profile?.nameEffect === 'rainbow') {
      style.animation = 'rainbow 3s linear infinite';
    }

    return style;
  };

  return (
    <div className="inline-flex flex-col items-start">
      {showTitle && profile?.displayTitle && (
        <span className="text-xs text-destiny-gold font-bold mb-1">
          [{profile.displayTitle}]
        </span>
      )}
      <span style={getNameStyle()} className="font-medium">
        {userName}
      </span>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes rainbow {
          0% { color: #f2721b; }
          14% { color: #4a90e2; }
          28% { color: #8e44ad; }
          42% { color: #f1c40f; }
          56% { color: #e74c3c; }
          70% { color: #2ecc71; }
          84% { color: #f39c12; }
          100% { color: #f2721b; }
        }
      `}</style>
    </div>
  );
}
