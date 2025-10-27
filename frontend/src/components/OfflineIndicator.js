import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) {
    return null;
  }

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="indicator-content">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Connection restored</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>You're offline - Using cached data</span>
          </>
        )}
      </div>
      <button 
        className="close-button"
        onClick={() => setShowBanner(false)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default OfflineIndicator;
