/// <reference lib="dom" />

/** @jsxImportSource https://esm.sh/react */
import { useState, useEffect } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function App() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style>{style}</style>
            <div className={`container ${isVisible ? 'fade-in' : ''}`}>
                <header>
                    <nav>
                        <a href="#" className="logo">Smallweb</a>
                        <div className="nav-links">
                            <a href="https://docs.smallweb.run" target="_blank">Docs</a>
                            <a href="https://blog.smallweb.run" target="_blank">Blog</a>
                            <a href="https://discord.smallweb.run" target="_blank">Discord</a>
                            <a href="https://github.com/pomdtr/smallweb" target="_blank">Github</a>
                        </div>
                    </nav>
                    <div className="hero">
                        <h1>Your Internet Folder</h1>
                        <p className="tagline">A lightweight, self-hosted serverless platform based on Deno</p>
                        <a href="https://docs.smallweb.run" className="cta-button">Get Started</a>
                    </div>
                </header>

                <main>
                    <section className="architecture-schema animate-on-scroll">
                        <h2>How It Works</h2>
                        <p>
                            Smallweb maps domains to folders in your filesystem. For example, with the <code>smallweb.run</code> domain:
                        </p>
                        <svg viewBox="0 0 800 380" className="schema">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="2" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#5E6AD2" />
                                </marker>
                            </defs>
                            <rect x="50" y="50" width="300" height="300" rx="10" ry="10" fill="#1E2028" stroke="#5E6AD2" strokeWidth="2" />
                            <text x="200" y="30" textAnchor="middle" fill="#E2E8F0" fontSize="20">Filesystem</text>
                            <rect x="70" y="70" width="260" height="50" rx="5" ry="5" fill="#2C3E50" stroke="#5E6AD2" strokeWidth="2" />
                            <text x="200" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="16">~/smallweb</text>
                            <a href="https://github.smallweb.run/www" target="_blank">
                                <rect x="90" y="140" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="200" y="165" textAnchor="middle" fill="#E2E8F0" fontSize="14">www</text>
                            </a>
                            <a href="https://github.smallweb.run/blog" target="_blank">
                                <rect x="90" y="190" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="200" y="215" textAnchor="middle" fill="#E2E8F0" fontSize="14">blog</text>
                            </a>
                            <a href="https://github.smallweb.run/discord" target="_blank">
                                <rect x="90" y="240" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="200" y="265" textAnchor="middle" fill="#E2E8F0" fontSize="14">discord</text>
                            </a>
                            <rect x="450" y="50" width="300" height="300" rx="10" ry="10" fill="#1E2028" stroke="#5E6AD2" strokeWidth="2" />
                            <text x="600" y="30" textAnchor="middle" fill="#E2E8F0" fontSize="20">Domains</text>
                            <rect x="470" y="70" width="260" height="50" rx="5" ry="5" fill="#2C3E50" stroke="#5E6AD2" strokeWidth="2" />
                            <text x="600" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="16">smallweb.run</text>
                            <a href="https://www.smallweb.run" target="_blank">
                                <rect x="490" y="140" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="600" y="165" textAnchor="middle" fill="#E2E8F0" fontSize="14">www.smallweb.run</text>
                            </a>
                            <a href="https://blog.smallweb.run" target="_blank">
                                <rect x="490" y="190" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="600" y="215" textAnchor="middle" fill="#E2E8F0" fontSize="14">blog.smallweb.run</text>
                            </a>
                            <a href="https://discord.smallweb.run" target="_blank">
                                <rect x="490" y="240" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                                <text x="600" y="265" textAnchor="middle" fill="#E2E8F0" fontSize="14">discord.smallweb.run</text>
                            </a>
                            <line x1="310" y1="160" x2="490" y2="160" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="310" y1="210" x2="490" y2="210" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="310" y1="260" x2="490" y2="260" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        </svg>
                        <p>
                            Creating a new website is as simple as creating a folder and opening the corresponding URL in your browser.
                        </p>
                    </section>

                    <section id="features" className="features animate-on-scroll">
                        <h2>Key Features</h2>
                        <ul>
                            <li>🚀 <strong>Serverless</strong>: Self-hosted platform with sandboxed execution for each request</li>
                            <li>🗂️ <strong>Folder-based</strong>: Map domains to folders in your filesystem</li>
                            <li>🔒 <strong>Secure</strong>: Sandboxed environment with limited access</li>
                            <li>🔄 <strong>Easy Migration</strong>: Seamlessly move to Deno Deploy when you need to scale</li>
                        </ul>
                    </section>

                    <section id="examples" className="examples animate-on-scroll">
                        <h2>Examples</h2>
                        <p>
                            Explore these Smallweb-hosted websites:
                        </p>
                        <div className="example-grid">
                            <a href="https://astro.smallweb.run" target="_blank" className="example-item">astro.smallweb.run</a>
                            <a href="https://blog.smallweb.run" target="_blank" className="example-item">blog.smallweb.run</a>
                            <a href="https://excalidraw.smallweb.run" target="_blank" className="example-item">excalidraw.smallweb.run</a>
                        </div>
                    </section>
                </main>

                <footer>
                    <p>
                        Smallweb is open-source and GPL licensed.
                    </p>
                    <p>
                        <a href="https://github.smallweb.run">View Source</a>
                    </p>
                </footer>
            </div>
        </>
    );
}

const style = /* css */ `
:root {
    --primary-color: #5E6AD2;
    --background-color: #0E1015;
    --text-color: #E2E8F0;
    --secondary-color: #1E2028;
    --accent-color: #8A8F98;
}

body {
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.6;
    color: var(--text-color);
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in {
    opacity: 1;
    transform: translateY(0);
}

header {
    margin-bottom: 120px;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
}

.logo {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
}

.nav-links a {
    margin-left: 20px;
    color: var(--text-color);
    text-decoration: none;
}

.hero {
    text-align: center;
    margin-top: 100px;
}

h1 {
    font-size: 3.5em;
    margin-bottom: 20px;
    background: linear-gradient(45deg, var(--primary-color), #A5B4FC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.tagline {
    font-size: 1.5em;
    color: var(--accent-color);
    margin-bottom: 30px;
}

h2 {
    font-size: 2.5em;
    margin-bottom: 30px;
    color: var(--primary-color);
}

ul {
    line-height: 2;
}

a {
    color: var(--primary-color);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

code {
    background-color: var(--secondary-color);
    padding: 2px 6px;
    border-radius: 4px;
}

.cta-button {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-weight: bold;
}

.cta-button:hover {
    background-color: #4A55B9;
    transform: translateY(-2px);
    text-decoration: none;
}

.feature-grid,
.example-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.feature-item,
.example-item {
    background-color: var(--secondary-color);
    padding: 20px;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.feature-item:hover,
.example-item:hover {
    transform: translateY(-5px);
}

.feature-item h3 {
    margin-top: 0;
    color: var(--primary-color);
}

.example-item {
    text-align: center;
    font-weight: bold;
}

section {
    margin-bottom: 60px;
}

footer {
    text-align: center;
    margin-top: 60px;
    padding: 20px 0;
    border-top: 1px solid var(--secondary-color);
    color: var(--accent-color);
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.animate-on-scroll.animate {
    opacity: 1;
    transform: translateY(0);
}

.architecture-schema {
    margin-top: 40px;
    text-align: center;
}

.schema {
    max-width: 100%;
    height: auto;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }

    h1 {
        font-size: 2.5em;
    }

    .tagline {
        font-size: 1.2em;
    }
}
`;


createRoot(document.getElementById("root")!).render(<App />);

