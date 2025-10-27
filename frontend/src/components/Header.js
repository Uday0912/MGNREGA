import React from 'react';
import { Menu, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">
          <h1 className="header-main-title">CitizenSpark</h1>
          <span className="header-subtitle">Employment & Work Data</span>
        </div>
      </div>

      <div className="header-right">
        <div className="connection-status">
          {isOnline ? (
            <div className="status-online">
              <Wifi size={16} />
              <span>Online</span>
            </div>
          ) : (
            <div className="status-offline">
              <WifiOff size={16} />
              <span>Offline</span>
            </div>
          )}
        </div>

        <button 
          className="refresh-button"
          onClick={() => window.location.reload()}
          aria-label="Refresh data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
