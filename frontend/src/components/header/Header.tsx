import './Header.css';

export function Header() {
    return (
        <header className="header glass-panel">
            <div className="logo-container">
                <div className="logo-icon"></div>
                <h1 className="logo-text text-gradient">VoxChain</h1>
            </div>
            <div className="status-indicator">
                <span className="status-dot"></span>
                Online
            </div>
        </header>
    );
}
