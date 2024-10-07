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
        <div className={`container ${isVisible ? 'fade-in' : ''}`}>
            <header>
                <nav>
                    <a href="#" className="logo">Smallweb</a>
                    <div className="nav-links">
                        <a href="https://docs.smallweb.run" target="_blank">Docs</a>
                        <a href="https://blog.smallweb.run" target="_blank">Blog</a>
                        <a href="https://discord.smallweb.run" target="_blank">Discord</a>
                        <a href="https://github.com/pomdtr/smallweb" target="_blank">GitHub</a>
                    </div>
                </nav>
                <div className="hero">
                    <h1>Your Internet Folder</h1>
                    <p className="tagline">A lightweight, self-hosted serverless platform based on Deno</p>
                    <a href="#get-started" className="cta-button">Get Started</a>
                </div>
            </header>

            <main>
                <section id="features" className="features">
                    <h2>Key Features</h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <h3>🚀 Serverless</h3>
                            <p>Self-hosted platform with sandboxed execution for each request</p>
                        </div>
                        <div className="feature-item">
                            <h3>🗂️ Folder-based</h3>
                            <p>Map domains to folders in your filesystem</p>
                        </div>
                        <div className="feature-item">
                            <h3>🔒 Secure</h3>
                            <p>Sandboxed environment with limited access</p>
                        </div>
                        <div className="feature-item">
                            <h3>🔄 Easy Migration</h3>
                            <p>Seamlessly move to Deno Deploy when you need to scale</p>
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="how-it-works animate-on-scroll">
                    <h2>How It Works</h2>
                    <p>
                        Smallweb maps domains to folders in your filesystem. For example, with the <code>smallweb.run</code> domain:
                    </p>
                    <ul>
                        <li><code>https://example.smallweb.run</code> maps to <code>~/smallweb/example</code></li>
                        <li><code>https://smallweb.run</code> maps to <code>~/smallweb/@</code> or <code>~/smallweb/www</code></li>
                    </ul>
                    <p>
                        Creating a new website is as simple as creating a folder and opening the corresponding URL in your browser.
                        No build step or development server required!
                    </p>
                </section>

                <section className="architecture-schema animate-on-scroll">
                    <svg viewBox="0 0 800 400" className="schema">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="2" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#5E6AD2" />
                            </marker>
                        </defs>
                        <rect x="50" y="50" width="300" height="300" rx="10" ry="10" fill="#1E2028" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="200" y="30" textAnchor="middle" fill="#E2E8F0" fontSize="20">Filesystem</text>
                        <rect x="70" y="70" width="260" height="50" rx="5" ry="5" fill="#2C3E50" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="200" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="16">~/smallweb</text>
                        <rect x="90" y="140" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="200" y="165" textAnchor="middle" fill="#E2E8F0" fontSize="14">www</text>
                        <rect x="90" y="190" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="200" y="215" textAnchor="middle" fill="#E2E8F0" fontSize="14">blog</text>
                        <rect x="90" y="240" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />

                        <text x="200" y="265" textAnchor="middle" fill="#E2E8F0" fontSize="14">docs</text>
                        <rect x="450" y="50" width="300" height="300" rx="10" ry="10" fill="#1E2028" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="600" y="30" textAnchor="middle" fill="#E2E8F0" fontSize="20">Domains</text>
                        <rect x="470" y="70" width="260" height="50" rx="5" ry="5" fill="#2C3E50" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="600" y="100" textAnchor="middle" fill="#E2E8F0" fontSize="16">smallweb.run</text>
                        <rect x="490" y="140" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="600" y="165" textAnchor="middle" fill="#E2E8F0" fontSize="14">www.smallweb.run</text>
                        <rect x="490" y="190" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="600" y="215" textAnchor="middle" fill="#E2E8F0" fontSize="14">blog.smallweb.run</text>
                        <rect x="490" y="240" width="220" height="40" rx="5" ry="5" fill="#34495E" stroke="#5E6AD2" strokeWidth="2" />
                        <text x="600" y="265" textAnchor="middle" fill="#E2E8F0" fontSize="14">docs.smallweb.run</text>
                        <line x1="310" y1="160" x2="490" y2="160" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <line x1="310" y1="210" x2="490" y2="210" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <line x1="310" y1="260" x2="490" y2="260" stroke="#5E6AD2" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    </svg>
                </section>


                <section id="get-started" className="get-started animate-on-scroll">
                    <h2>Get Started</h2>
                    <p>
                        Ready to try smallweb? Follow the documentation to get started:
                    </p>
                    <a href="https://docs.smallweb.run" target="_blank" className="cta-button">Read the Docs</a>
                </section>

                <section id="examples" className="examples animate-on-scroll">
                    <h2>Examples</h2>
                    <p>
                        Explore these Smallweb-hosted websites:
                    </p>
                    <div className="example-grid">
                        <a href="https://docs.smallweb.run" target="_blank" className="example-item">docs.smallweb.run</a>
                        <a href="https://blog.smallweb.run" target="_blank" className="example-item">blog.smallweb.run</a>
                        <a href="https://excalidraw.smallweb.run" target="_blank" className="example-item">excalidraw.smallweb.run</a>
                    </div>
                </section>

                <section className="community animate-on-scroll">
                    <h2>Community</h2>
                    <a href="https://discord.smallweb.run" target="_blank" className="cta-button">Join Discord Server</a>
                </section>
            </main>

            <footer>
                <p>
                    Smallweb is open-source and GPL licensed.
                </p>
            </footer>
        </div>
    );
}


createRoot(document.getElementById("root")!).render(<App />);

