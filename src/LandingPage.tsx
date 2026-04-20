<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NEXUS — AI Multimodal Chatbot</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #020608;
    --surface: #080f12;
    --border: #0d2029;
    --accent: #00e5ff;
    --accent2: #7b2fff;
    --accent3: #ff4d6d;
    --text: #e8f4f8;
    --muted: #4a7080;
    --glow: 0 0 40px rgba(0,229,255,0.15);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: screen;
  }
  .cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1px solid rgba(0,229,255,0.4);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease, width 0.2s, height 0.2s;
  }

  /* Grid background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    border-bottom: 1px solid var(--border);
    background: rgba(2,6,8,0.85);
    backdrop-filter: blur(20px);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: 0.15em;
    color: var(--accent);
    text-shadow: 0 0 20px rgba(0,229,255,0.5);
  }
  .nav-logo span { color: var(--text); }
  .nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
  }
  .nav-links a {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta {
    padding: 10px 24px;
    border: 1px solid var(--accent);
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .nav-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform: translateX(-100%);
    transition: transform 0.2s;
    z-index: -1;
  }
  .nav-cta:hover { color: var(--bg); }
  .nav-cta:hover::before { transform: translateX(0); }

  /* HERO */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 140px 60px 80px;
    z-index: 1;
    overflow: hidden;
  }

  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .hero-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,229,255,0.12), transparent 70%);
    top: -100px; right: 100px;
    animation: orb-float 8s ease-in-out infinite;
  }
  .hero-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(123,47,255,0.1), transparent 70%);
    bottom: 0; left: 200px;
    animation: orb-float 10s ease-in-out infinite reverse;
  }
  @keyframes orb-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.68rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid rgba(0,229,255,0.3);
    padding: 6px 16px;
    width: fit-content;
    margin-bottom: 32px;
    animation: fade-up 0.8s ease both;
  }
  .hero-tag::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: blink 1.5s ease infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(3.5rem, 8vw, 7rem);
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
    animation: fade-up 0.8s 0.1s ease both;
  }
  .hero-title .line-accent { color: var(--accent); }
  .hero-title .line-dim { color: var(--muted); }

  .hero-desc {
    font-size: 0.88rem;
    line-height: 1.8;
    color: var(--muted);
    max-width: 480px;
    margin-bottom: 48px;
    animation: fade-up 0.8s 0.2s ease both;
  }
  .hero-desc strong { color: var(--text); font-weight: 400; }

  .hero-actions {
    display: flex;
    gap: 16px;
    align-items: center;
    animation: fade-up 0.8s 0.3s ease both;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    background: var(--accent);
    color: var(--bg);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 400;
    transition: all 0.2s;
    box-shadow: 0 0 30px rgba(0,229,255,0.3);
  }
  .btn-primary:hover {
    box-shadow: 0 0 50px rgba(0,229,255,0.5);
    transform: translateY(-2px);
  }
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 28px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s;
  }
  .btn-secondary:hover { color: var(--text); }
  .btn-secondary svg { transition: transform 0.2s; }
  .btn-secondary:hover svg { transform: translateX(4px); }

  /* Animated chat preview */
  .hero-visual {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    width: 420px;
    animation: fade-up 0.8s 0.4s ease both;
  }
  .chat-window {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .chat-window::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .chat-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.7rem;
    color: var(--bg);
  }
  .chat-name {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text);
  }
  .chat-status {
    font-size: 0.65rem;
    color: var(--accent);
    letter-spacing: 0.1em;
  }
  .chat-status::before {
    content: '● ';
    font-size: 0.5rem;
  }
  .chat-msg {
    margin-bottom: 14px;
    animation: msg-appear 0.5s ease both;
  }
  .chat-msg.user { text-align: right; }
  .chat-bubble {
    display: inline-block;
    padding: 10px 16px;
    font-size: 0.75rem;
    line-height: 1.6;
    max-width: 85%;
    text-align: left;
  }
  .chat-bubble.ai {
    background: rgba(0,229,255,0.06);
    border: 1px solid rgba(0,229,255,0.15);
    color: var(--text);
  }
  .chat-bubble.user-bubble {
    background: rgba(123,47,255,0.15);
    border: 1px solid rgba(123,47,255,0.3);
    color: var(--text);
  }
  .chat-bubble .tag {
    font-size: 0.6rem;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 4px;
  }
  .chat-input-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .chat-input-bar input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
  }
  .chat-input-icons {
    display: flex;
    gap: 8px;
  }
  .chat-input-icons span {
    font-size: 0.75rem;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s;
  }
  .chat-input-icons span:hover { color: var(--accent); }

  @keyframes msg-appear {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Stats */
  .hero-stats {
    display: flex;
    gap: 48px;
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid var(--border);
    animation: fade-up 0.8s 0.5s ease both;
  }
  .stat-item {}
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 0.68rem;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* FEATURES */
  .section {
    position: relative;
    z-index: 1;
    padding: 120px 60px;
  }
  .section-label {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.1;
    margin-bottom: 60px;
    color: var(--text);
  }
  .section-title em {
    font-style: normal;
    color: var(--accent);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
  }
  .feature-card {
    background: var(--bg);
    padding: 40px 36px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
  }
  .feature-card:hover { background: var(--surface); }
  .feature-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transform: scaleX(0);
    transition: transform 0.3s;
    transform-origin: left;
  }
  .feature-card:hover::after { transform: scaleX(1); }
  .feature-icon {
    width: 48px; height: 48px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 24px;
    transition: border-color 0.3s;
  }
  .feature-card:hover .feature-icon { border-color: var(--accent); }
  .feature-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 12px;
    letter-spacing: 0.02em;
  }
  .feature-desc {
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.8;
  }

  /* HOW IT WORKS */
  .how-section {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .step {
    padding: 48px 36px;
    border-right: 1px solid var(--border);
    position: relative;
  }
  .step:last-child { border-right: none; }
  .step-num {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 3rem;
    color: var(--border);
    line-height: 1;
    margin-bottom: 20px;
    transition: color 0.3s;
  }
  .step:hover .step-num { color: var(--accent); }
  .step-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 10px;
    color: var(--text);
  }
  .step-desc {
    font-size: 0.76rem;
    color: var(--muted);
    line-height: 1.8;
  }

  /* MODALITIES */
  .modalities {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--border);
    margin-top: 60px;
  }
  .modality {
    background: var(--bg);
    padding: 36px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: background 0.2s;
  }
  .modality:hover { background: var(--surface); }
  .mod-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  .mod-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 6px;
  }
  .mod-desc {
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.6;
  }

  /* CTA */
  .cta-section {
    text-align: center;
    padding: 120px 60px;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .cta-section::before {
    content: 'NEXUS';
    position: absolute;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20vw;
    color: rgba(0,229,255,0.02);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    white-space: nowrap;
  }
  .cta-section .section-label { justify-content: center; display: flex; }
  .cta-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.05;
    margin-bottom: 20px;
    color: var(--text);
  }
  .cta-title em { font-style: normal; color: var(--accent); }
  .cta-sub {
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 48px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.8;
  }
  .cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 40px 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .footer-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 0.15em;
    color: var(--accent);
  }
  .footer-copy {
    font-size: 0.68rem;
    color: var(--muted);
    letter-spacing: 0.05em;
  }
  .footer-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }
  .footer-links a {
    font-size: 0.68rem;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--accent); }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Typing animation */
  .typing-cursor::after {
    content: '|';
    animation: blink-cursor 1s step-end infinite;
    color: var(--accent);
  }
  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); }

  @media (max-width: 900px) {
    nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .hero { padding: 120px 24px 60px; }
    .hero-visual { display: none; }
    .hero-stats { gap: 28px; flex-wrap: wrap; }
    .section { padding: 80px 24px; }
    .features-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr 1fr; }
    .step { border-bottom: 1px solid var(--border); }
    .modalities { grid-template-columns: 1fr; }
    .cta-section { padding: 80px 24px; }
    footer { padding: 32px 24px; flex-direction: column; gap: 20px; text-align: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
</style>
</head>
<body>

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>

<!-- NAV -->
<nav>
  <div class="nav-logo">NEX<span>US</span></div>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#how">How It Works</a></li>
    <li><a href="#modalities">Modalities</a></li>
  </ul>
  <a href="https://nexus-4ga6.vercel.app" class="nav-cta">Launch App →</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-orb hero-orb-1"></div>
  <div class="hero-orb hero-orb-2"></div>

  <div class="hero-tag">AI-Powered · Low-Latency · Multimodal</div>

  <h1 class="hero-title">
    <span class="line-dim">Talk to</span><br>
    <span class="line-accent">Intelligence</span><br>
    <span>That Sees.</span>
  </h1>

  <p class="hero-desc">
    NEXUS is a <strong>multimodal AI chatbot</strong> that understands text, images, and voice — delivering real-time responses with sub-second latency. Built for the next generation of human-AI interaction.
  </p>

  <div class="hero-actions">
    <a href="https://nexus-4ga6.vercel.app" class="btn-primary">
      <span>Start Chatting</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </a>
    <a href="#features" class="btn-secondary">
      Explore Features
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </a>
  </div>

  <div class="hero-stats">
    <div class="stat-item">
      <div class="stat-value">&lt;100ms</div>
      <div class="stat-label">Response Latency</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">3+</div>
      <div class="stat-label">Input Modalities</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">24/7</div>
      <div class="stat-label">Always On</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">∞</div>
      <div class="stat-label">Context Window</div>
    </div>
  </div>

  <!-- Chat Preview -->
  <div class="hero-visual">
    <div class="chat-window">
      <div class="chat-header">
        <div class="chat-avatar">NX</div>
        <div>
          <div class="chat-name">NEXUS AI</div>
          <div class="chat-status">Online</div>
        </div>
      </div>

      <div class="chat-msg user">
        <div class="chat-bubble user-bubble">
          Can you analyze this image and explain what you see?
        </div>
      </div>

      <div class="chat-msg" style="animation-delay:0.3s">
        <div class="chat-bubble ai">
          <span class="tag">Vision Analysis</span>
          I can see a detailed architectural diagram with three microservice clusters connected via an event-driven message bus...
        </div>
      </div>

      <div class="chat-msg user" style="animation-delay:0.6s">
        <div class="chat-bubble user-bubble">
          Now summarize it as a voice memo.
        </div>
      </div>

      <div class="chat-msg" style="animation-delay:0.9s">
        <div class="chat-bubble ai">
          <span class="tag">🎙 Audio Response Ready</span>
          <span class="typing-cursor">Generating audio summary</span>
        </div>
      </div>

      <div class="chat-input-bar">
        <input type="text" placeholder="Type, speak, or drop an image..." readonly>
        <div class="chat-input-icons">
          <span title="Voice">🎤</span>
          <span title="Image">🖼</span>
          <span title="Send">↵</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="section" id="features">
  <div class="section-label">// Capabilities</div>
  <h2 class="section-title">Built different.<br><em>Designed to think.</em></h2>

  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <div class="feature-name">Low-Latency Architecture</div>
      <p class="feature-desc">Engineered from the ground up for speed. Responses stream in real-time with sub-100ms first-token latency — no waiting, no lag.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">👁</div>
      <div class="feature-name">Vision Understanding</div>
      <p class="feature-desc">Upload screenshots, diagrams, photos, or documents. NEXUS analyzes visual content with precision and contextual depth.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🎙</div>
      <div class="feature-name">Voice Interface</div>
      <p class="feature-desc">Speak naturally. NEXUS transcribes, understands, and responds — enabling hands-free, voice-first conversations.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🧠</div>
      <div class="feature-name">Deep Context Memory</div>
      <p class="feature-desc">Maintains conversation context across long sessions. NEXUS remembers what matters so you don't have to repeat yourself.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔀</div>
      <div class="feature-name">Multimodal Fusion</div>
      <p class="feature-desc">Combine text, images, and voice in a single message. NEXUS synthesizes all inputs into one unified, intelligent response.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🌐</div>
      <div class="feature-name">Always Available</div>
      <p class="feature-desc">Deployed on global edge infrastructure. NEXUS is accessible anywhere, anytime with consistent performance worldwide.</p>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="section how-section" id="how">
  <div class="section-label">// Process</div>
  <h2 class="section-title">How <em>NEXUS</em> works.</h2>

  <div class="steps">
    <div class="step">
      <div class="step-num">01</div>
      <div class="step-title">Send Any Input</div>
      <p class="step-desc">Type a question, upload an image, or record your voice — NEXUS accepts all formats simultaneously.</p>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <div class="step-title">Multimodal Processing</div>
      <p class="step-desc">Inputs are fused and processed through our low-latency AI pipeline optimized for speed and accuracy.</p>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <div class="step-title">Intelligent Response</div>
      <p class="step-desc">Receive rich, contextual answers in text or audio — streamed in real-time as they are generated.</p>
    </div>
    <div class="step">
      <div class="step-num">04</div>
      <div class="step-title">Continuous Learning</div>
      <p class="step-desc">Every interaction improves context. NEXUS adapts to your style and preferences over time.</p>
    </div>
  </div>
</section>

<!-- MODALITIES -->
<section class="section" id="modalities">
  <div class="section-label">// Input Modes</div>
  <h2 class="section-title">Every way you<br><em>communicate.</em></h2>

  <div class="modalities">
    <div class="modality">
      <div class="mod-icon">💬</div>
      <div>
        <div class="mod-name">Text</div>
        <p class="mod-desc">Natural language understanding with deep reasoning, code generation, and creative writing.</p>
      </div>
    </div>
    <div class="modality">
      <div class="mod-icon">🖼</div>
      <div>
        <div class="mod-name">Image</div>
        <p class="mod-desc">Upload photos, diagrams, screenshots, or documents for visual analysis and extraction.</p>
      </div>
    </div>
    <div class="modality">
      <div class="mod-icon">🎤</div>
      <div>
        <div class="mod-name">Voice</div>
        <p class="mod-desc">Speak your query and receive spoken responses — ideal for mobile and hands-free use.</p>
      </div>
    </div>
    <div class="modality">
      <div class="mod-icon">📄</div>
      <div>
        <div class="mod-name">Documents</div>
        <p class="mod-desc">Analyze PDFs, reports, and structured data — extract insights instantly from any file.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="section-label">// Get Started</div>
  <h2 class="cta-title">The future of<br><em>conversation</em><br>is here.</h2>
  <p class="cta-sub">Join early users experiencing the next generation of AI. No setup required.</p>
  <div class="cta-buttons">
    <a href="https://nexus-4ga6.vercel.app" class="btn-primary">
      Launch NEXUS →
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">NEXUS</div>
  <p class="footer-copy">© 2026 NEXUS AI. Built for the future.</p>
  <ul class="footer-links">
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</footer>

<script>
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      ring.style.width = '60px';
      ring.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fade-up 0.7s ease both';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .step, .modality').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
</script>
</body>
</html>
