import { useEffect, useState } from 'react'
import './Navbar.css'
import profileImage from '../../assets/profile.png'

export default function Navbar({ onToggleSidebar, searchTerm = '', onSearchChange }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 479px)').matches : false
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 479px)')

    const handleChange = () => setIsMobile(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener?.('change', handleChange)

    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [])

  return (
    <nav>
      <div className="logo-area">
        <div className="tooltip">
          <button
            type="button"
            className="menu-btn"
            onClick={() => onToggleSidebar?.()}
            aria-label="Toggle sidebar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined hover">menu</span>
          </button>
          <span className="tooltip-text">Main Menu</span>
        </div>
        <img
          className="gb_Hc gb_Hd"
          src="https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_2x_web_48dp.png"
          srcset="https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_1x_web_48dp.png 1x, https://www.gstatic.com/images/branding/productlogos/keep_2026/v2/web-48dp/logo_keep_2026_color_2x_web_48dp.png 2x"
          alt=""
          aria-hidden="true"
          role="presentation"
          style={{ width: '40px', height: '40px' }}
        />
        <span className="logo-text">Keep</span>
      </div>



      {/* Search Icon (always visible) */}
      <button
        type="button"
        className="mobile-search-toggle"
        aria-label={showMobileSearch ? 'Close search' : 'Open search'}
        onClick={() => setShowMobileSearch((prev) => !prev)}
        style={{ marginLeft: 12, marginRight: 12 }}
      >
        <span className="material-symbols-outlined hover">
          {showMobileSearch ? 'close' : 'search'}
        </span>
      </button>

      {/* Search input only appears when toggled (mobile) or always on desktop */}
      {((!isMobile && !showMobileSearch) || (isMobile && showMobileSearch)) && (
        <div className={`search-area${showMobileSearch ? ' search-area--mobile-open' : ''}`}>
          <span className="material-symbols-outlined search-area__icon" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            autoFocus={showMobileSearch}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search notes"
          />
        </div>
      )}

      <div className="navbar-actions">
        <div className="settings-area">
          <div className="tooltip">
            <span className="material-symbols-outlined hover">refresh</span>
            <span className="tooltip-text">Refresh</span>
          </div>

          <div className="tooltip">
            <span className="material-symbols-outlined hover">view_agenda</span>
            <span className="tooltip-text">View List</span>
          </div>

          <div className="tooltip">
            <span className="material-symbols-outlined hover">settings</span>
            <span className="tooltip-text">Settings</span>
          </div>
        </div>

        <div className="profile-actions-area">
          <div className="tooltip">
            <span className="material-symbols-outlined hover">apps</span>
            <span className="tooltip-text">Apps</span>
          </div>

          <div className="tooltip">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-avatar hover"
            />
            <span className="tooltip-text">Accounts</span>
          </div>
        </div>
      </div>
    </nav>
  )
}