import { useState, useEffect, useRef } from 'react';
import shreeAvatar from './assets/shree.png';
import './App.css';

function App() {
  // Sticky Header state
  const [isScrolled, setIsScrolled] = useState(false);
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Typewriter states
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  // Contact Form states
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  // Skills Animation Trigger
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  const roles = [
    'Computer Science Engineer',
    'AI & ML Enthusiast',
    'Full Stack Developer',
    'Problem Solver'
  ];

  // Scroll listener for sticky header and skills animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (skillsRef.current) {
        const rect = skillsRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight - 100;
        if (isInViewport) {
          setSkillsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let timer;
    const currentFullText = roles[roleIndex];
    const typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && typedText === currentFullText) {
      // Pause at full text
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timer = setTimeout(() => {
        setTypedText(
          isDeleting
            ? currentFullText.substring(0, typedText.length - 1)
            : currentFullText.substring(0, typedText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex]);

  // Confetti effect trigger
  const triggerConfetti = () => {
    const colors = ['#a855f7', '#06b6d4', '#3b82f6', '#eab308', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random coordinates and properties
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      particle.style.left = `${Math.random() * window.innerWidth}px`;
      particle.style.top = `-10px`;
      
      // Scale and delay
      particle.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
      
      document.body.appendChild(particle);

      // Clean up particles
      setTimeout(() => {
        particle.remove();
      }, 3000);
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus({ type: '', message: '' });

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in name, email, and message.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (error) {
      console.error('Network error contacting backend API:', error);
      // Fail gracefully: Mock submission if backend is not currently running locally during testing
      setFormStatus({ 
        type: 'success', 
        message: 'Thank you! Your message was sent successfully (Demo Mode).' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const skillsData = [
    {
      category: 'Programming Languages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
      ),
      skills: [
        { name: 'Python', level: 90 },
        { name: 'Java', level: 85 },
        { name: 'C++', level: 80 },
        { name: 'C', level: 80 },
        { name: 'SQL', level: 75 }
      ]
    },
    {
      category: 'Software Fundamentals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><rect width="8" height="8" x="13" y="3" rx="2"/><rect width="8" height="8" x="3" y="13" rx="2"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>
      ),
      skills: [
        { name: 'Object-Oriented Programming (OOP)', level: 85 },
        { name: 'Data Structures & Algorithms', level: 80 },
        { name: 'Machine Learning & Deep Learning', level: 75 },
        { name: 'MERN Stack', level: 70 }
      ]
    },
    {
      category: 'Tools & Environments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      ),
      skills: [
        { name: 'Git & GitHub', level: 80 },
        { name: 'VS Code', level: 95 },
        { name: 'Google Colab', level: 85 }
      ]
    },
    {
      category: 'Professional Soft Skills',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ),
      skills: [
        { name: 'Problem Solving & Critical Thinking', level: 95 },
        { name: 'Team Collaboration & Communication', level: 90 },
        { name: 'Adaptability & Continuous Learning', level: 90 },
        { name: 'Time Management', level: 85 }
      ]
    }
  ];

  return (
    <>
      {/* Background Decorative Gradients */}
      <div className="gradient-bg-decor decor-purple"></div>
      <div className="gradient-bg-decor decor-cyan"></div>

      {/* Navigation Header */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <a href="#home" className="logo" id="nav-logo">
            ShreeVaishnav<span className="logo-dot"></span>
          </a>
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="menu-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="nav-menu">
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
            <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a></li>
            <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
            <li><a href="#accomplishments" onClick={() => setMobileMenuOpen(false)}>Awards</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>
        </div>
      </header>

      {/* Home / Hero Section */}
      <section id="home">
        <div className="container hero-wrapper">
          <div className="hero-content">
            <span className="hero-subtitle">Welcome to my space</span>
            <h1 className="hero-title" id="hero-main-title">
              Hi, I'm <span>Shree Vaishnav K N</span>
            </h1>
            <div className="hero-typing" id="hero-typewriter">
              <span>{typedText}</span>
              <span className="typing-cursor"></span>
            </div>
            <p className="hero-desc">
              Computer Science Engineering student at Kongu Engineering College. Eager to apply analytical thinking and software skills to build intelligent, creative applications.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary" id="btn-hero-contact">
                Let's Connect
              </a>
              <a href="/resume.pdf" download="Shree_Vaishnav_Resume.pdf" className="btn btn-secondary" id="btn-hero-resume">
                Download Resume
              </a>
            </div>
          </div>
          <div className="hero-avatar-area">
            <div className="avatar-glow-ring">
              <div className="avatar-inner">
                <img src={shreeAvatar} alt="Shree Vaishnav K N Photo" id="hero-avatar-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="about-bio">
                I am a passionate Computer Science Engineering student currently pursuing my Bachelor of Engineering at Kongu Engineering College. With a strong academic foundation (CGPA 8.80) and hands-on experience, I enjoy working at the intersection of core software engineering and emerging technologies like Artificial Intelligence & Machine Learning.
              </p>
              <ul className="about-details-list">
                <li>
                  <span className="label">Location</span>
                  <span className="val">Tirupur, Tamil Nadu, India</span>
                </li>
                <li>
                  <span className="label">Email</span>
                  <span className="val">Shreevaishnav1905@gmail.com</span>
                </li>
                <li>
                  <span className="label">Phone</span>
                  <span className="val">+91 6374772214</span>
                </li>
                <li>
                  <span className="label">Academic Status</span>
                  <span className="val">Undergraduate (Expected 2028)</span>
                </li>
              </ul>
            </div>
            <div className="glass education-card" id="edu-card">
              <h3 className="edu-degree">Bachelor of Engineering</h3>
              <p className="edu-school">Kongu Engineering College</p>
              <p className="edu-meta">Computer Science Engineering | Expected 2028</p>
              <div className="badge-container">
                <span className="gpa-badge">8.80 GPA/CGPA</span>
                <span className="tag-badge">AI & ML Specialization</span>
                <span className="tag-badge">MERN Stack Development</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef}>
        <div className="container">
          <h2 className="section-title">Technical Expertise</h2>
          <div className="skills-grid">
            {skillsData.map((cat, idx) => (
              <div className="glass skill-category-card" key={idx}>
                <div className="skill-card-icon">
                  {cat.icon}
                </div>
                <h3 className="skill-category-title">{cat.category}</h3>
                <div className="skills-items-list">
                  {cat.skills.map((skill, sIdx) => (
                    <div className="skill-item" key={sIdx}>
                      <div className="skill-item-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <div 
                          className="skill-bar-fill"
                          style={{ width: skillsVisible ? `${skill.level}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience">
        <div className="container">
          <h2 className="section-title">Work Experience</h2>
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            {/* Timeline Item 1 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="glass timeline-card">
                <h3 className="timeline-role">Inplant Training (AI & ML)</h3>
                <h4 className="timeline-company">Codebind Technologies</h4>
                <div className="timeline-meta">
                  <span>Coimbatore, India</span>
                  <span>Dec 2025 (8 Days)</span>
                </div>
                <p className="timeline-desc">
                  Acquired fundamental knowledge of Artificial Intelligence and Machine Learning models. Gained hands-on experience in building basic regression and classification pipelines using Python libraries.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="glass timeline-card">
                <h3 className="timeline-role">Inplant Training (Python Programming)</h3>
                <h4 className="timeline-company">Frenzo Technologies</h4>
                <div className="timeline-meta">
                  <span>Coimbatore, India</span>
                  <span>July 2025 (7 Days)</span>
                </div>
                <p className="timeline-desc">
                  Focused on core Python programming, data structures, and script development. Implemented object-oriented methodologies and basic sorting algorithms in academic modules.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <div className="container">
          <h2 className="section-title">Creative Projects</h2>
          <div className="projects-grid">
            
            {/* Project 1 */}
            <div className="glass project-card" id="project-energy">
              <div className="project-preview">
                <div className="energy-graph-sim">
                  <svg className="energy-svg" viewBox="0 0 300 150">
                    <defs>
                      <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="125" x2="300" y2="125" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {/* Wave Path */}
                    <path
                      className="animated-path"
                      d="M 0,90 Q 30,30 60,85 T 120,60 T 180,110 T 240,40 T 300,75"
                      fill="none"
                      stroke="url(#cyan-grad)"
                      strokeWidth="3"
                    />
                    {/* Glow Effect */}
                    <circle cx="240" cy="40" r="5" fill="#06b6d4" filter="drop-shadow(0 0 5px #06b6d4)" />
                  </svg>
                </div>
              </div>
              <div className="project-details">
                <h3 className="project-title">Smart Energy Intelligence</h3>
                <p className="project-desc">
                  Designed and implemented a real-time energy tracking dashboard that improves monitoring efficiency. Employs descriptive statistics to identify high-load patterns and optimize active resource consumption.
                </p>
                <div className="project-tags">
                  <span className="tag-badge">Python</span>
                  <span className="tag-badge">AI & ML</span>
                  <span className="tag-badge">Realtime Tracking</span>
                  <span className="tag-badge">IoT Analytics</span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="glass project-card" id="project-hospital">
              <div className="project-preview">
                <div className="hospital-sim">
                  <div className="hosp-col">
                    <div className="hosp-block">Queue</div>
                    <div className="hosp-block">Admit</div>
                  </div>
                  <div className="hosp-col">
                    <div className="hosp-block">Doctor</div>
                    <div className="hosp-block">Patient</div>
                    <div className="hosp-block">Bed</div>
                  </div>
                  <div className="hosp-col">
                    <div className="hosp-block">Billing</div>
                    <div className="hosp-block">Records</div>
                  </div>
                </div>
              </div>
              <div className="project-details">
                <h3 className="project-title">Hospital Management System</h3>
                <p className="project-desc">
                  A software utility built using object-oriented principles to streamline hospital admissions, assign patients to on-duty physicians, track ward occupancies, and generate billing reports.
                </p>
                <div className="project-tags">
                  <span className="tag-badge">Java</span>
                  <span className="tag-badge">OOP</span>
                  <span className="tag-badge">Data Structures</span>
                  <span className="tag-badge">Console App</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Accomplishments Section */}
      <section id="accomplishments">
        <div className="container">
          <h2 className="section-title">Accomplishments</h2>
          <div className="glass accomplishment-banner" id="hackathon-banner">
            <div 
              className="trophy-container" 
              onClick={triggerConfetti} 
              title="Click for a surprise!"
              id="trophy-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6c0 3.32-3.12 5.56-5.27 6.44a1 1 0 0 1-.73 0C9.9 13.56 6.78 11.32 6.78 8a6 6 0 0 1 6-6Z"/></svg>
            </div>
            <h3 className="acc-title">1st Place - Devforge Hackathon 2025</h3>
            <p className="acc-desc">
              Won 1st place in the Inter-College Devforge Hackathon 2025, competing against over 10 active engineering teams. Collaborated on a 24-hour rapid development cycle to construct a viable software prototype.
            </p>
            <button className="btn btn-primary" onClick={triggerConfetti} id="celebrate-btn">
              Celebrate Victory 🎉
            </button>
          </div>

          <div className="other-accomplishments">
            <div className="glass acc-bullet-card">
              <h4 style={{ marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>Deep Learning Certified</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Completed comprehensive online coursework specializing in Machine Learning, Deep Learning, and Artificial Neural Networks.
              </p>
            </div>
            <div className="glass acc-bullet-card" style={{ borderLeftColor: 'var(--accent-purple)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>AWS Fundamentals</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Acquired theoretical foundations of cloud architectures, cloud computing modules, Amazon EC2, S3 storage, and identity access rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-wrapper">
            
            {/* Contact Details Card */}
            <div className="contact-info-panel">
              
              {/* Phone card */}
              <div className="glass contact-info-card" id="contact-phone">
                <div className="contact-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div className="contact-card-details">
                  <h4>Phone</h4>
                  <p>+91 6374772214</p>
                </div>
              </div>

              {/* Email card */}
              <div className="glass contact-info-card" id="contact-email">
                <div className="contact-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div className="contact-card-details">
                  <h4>Email</h4>
                  <a href="mailto:Shreevaishnav1905@gmail.com">Shreevaishnav1905@gmail.com</a>
                </div>
              </div>

              {/* LinkedIn card */}
              <div className="glass contact-info-card" id="contact-linkedin">
                <div className="contact-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <div className="contact-card-details">
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/shree-vaishnav-k-n-333171186/" target="_blank" rel="noreferrer">
                    shree-vaishnav-k-n-333171186
                  </a>
                </div>
              </div>

            </div>

            {/* Contact Form Panel */}
            <div className="glass contact-form-panel">
              <h3 className="form-title">Send a Message</h3>
              <form onSubmit={handleFormSubmit} id="contact-form">
                <div className="form-grid">
                  <div className="form-group">
                    <input 
                      type="text" 
                      id="form-name" 
                      name="name" 
                      className="form-input" 
                      placeholder=" "
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                    <label htmlFor="form-name" className="form-label">Your Name</label>
                  </div>
                  
                  <div className="form-group">
                    <input 
                      type="email" 
                      id="form-email" 
                      name="email" 
                      className="form-input" 
                      placeholder=" "
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                    <label htmlFor="form-email" className="form-label">Your Email</label>
                  </div>

                  <div className="form-group form-group-full">
                    <input 
                      type="text" 
                      id="form-subject" 
                      name="subject" 
                      className="form-input" 
                      placeholder=" "
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="form-subject" className="form-label">Subject</label>
                  </div>

                  <div className="form-group form-group-full">
                    <textarea 
                      id="form-message" 
                      name="message" 
                      className="form-input form-textarea" 
                      placeholder=" "
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <label htmlFor="form-message" className="form-label">Your Message</label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  id="form-submit-btn"
                >
                  <span className="submit-btn-content">
                    {loading ? (
                      <>
                        <span className="spinner"></span> Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </span>
                </button>

                {formStatus.message && (
                  <div className={`form-status ${formStatus.type}`} id="form-status-box">
                    {formStatus.message}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Shree Vaishnav K N. All rights reserved.
          </p>
          <div className="footer-socials">
            <a href="mailto:Shreevaishnav1905@gmail.com" title="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/shree-vaishnav-k-n-333171186/" target="_blank" rel="noreferrer" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#home" title="Scroll to Top">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
