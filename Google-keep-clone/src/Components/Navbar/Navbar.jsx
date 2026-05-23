import './Navbar.css' 

export default function Navbar({ onToggleSidebar, searchTerm = '', onSearchChange }) {
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

      <div className="search-area">
        <div className="tooltip-one">
          <span className="material-symbols-outlined hover">search</span>
          <span className="tooltip-text">Search</span>
        </div>
        <input 
          type="text" 
          placeholder="Search" 
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

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
            <span className="material-symbols-outlined hover profile"></span>
            <span className="tooltip-text">Accounts</span>
          </div>
        </div>
      </div>
    </nav>
  )
}