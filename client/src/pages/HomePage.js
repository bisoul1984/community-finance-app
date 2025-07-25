import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    loans: 0,
    success: 0,
    support: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats
    const animateStats = () => {
      const targetStats = { users: 1500, loans: 750, success: 98, support: 24 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          users: Math.floor(targetStats.users * progress),
          loans: Math.floor(targetStats.loans * progress),
          success: Math.floor(targetStats.success * progress),
          support: Math.floor(targetStats.support * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, increment);
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "MicroLoan helped me expand my bakery business. The community support was incredible!",
      avatar: "👩‍🍳"
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "I was able to pay for my education without traditional bank loans. Thank you MicroLoan!",
      avatar: "👨‍🎓"
    },
    {
      name: "Emma Rodriguez",
      role: "Community Lender",
      content: "I love helping others achieve their dreams while earning a fair return on my investment.",
      avatar: "👩‍💼"
    }
  ];

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Bank-Level Security",
      description: "256-bit encryption, secure payment processing, and fraud protection",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community Verification",
      description: "Trusted community members verify and support each other",
      color: "green"
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Approval",
      description: "Get approved in minutes with our smart verification system",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mobile First",
      description: "Access your loans and manage payments from anywhere",
      color: "orange"
    },
    {
      icon: (
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Transparent Tracking",
      description: "Real-time updates on loan status and repayment progress",
      color: "indigo"
    },
    {
      icon: (
        <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Global Community",
      description: "Connect with borrowers and lenders worldwide",
      color: "pink"
    }
  ];

  const loanCategories = [
    { 
      name: "Education", 
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ), 
      amount: "$5K - $25K", 
      rate: "3.5%" 
    },
    { 
      name: "Business", 
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ), 
      amount: "$10K - $100K", 
      rate: "4.2%" 
    },
    { 
      name: "Home", 
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      amount: "$20K - $200K", 
      rate: "3.8%" 
    },
    { 
      name: "Medical", 
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ), 
      amount: "$2K - $50K", 
      rate: "2.9%" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className={`bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                  MicroLoan
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['hero', 'features', 'about', 'testimonials', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-gray-700 hover:text-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-gray-600/5"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Empowering Dreams Through
                <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent"> MicroLoans</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Connect with your community to access affordable loans or help others achieve their goals. 
                Build trust, grow together, and create lasting financial relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Your Journey
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <button
                  onClick={() => scrollToSection('features')}
                  className="group border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Explore Features
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-slate-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gray-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-slate-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">MicroLoan</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform offers cutting-edge features that make borrowing and lending simple, secure, and community-driven.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-slate-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Categories Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Loan <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our diverse range of loan categories designed to meet your specific needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanCategories.map((category, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-2">Amount: {category.amount}</p>
                <p className="text-slate-700 font-semibold">Rate: {category.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-amber-400">Impact</span> in Numbers
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              See how we're making a difference in communities around the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400">{stats.users}+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400">${stats.loans}K+</div>
              <div className="text-lg opacity-90">Loans Funded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400">{stats.success}%</div>
              <div className="text-lg opacity-90">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400">{stats.support}/7</div>
              <div className="text-lg opacity-90">Support Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What Our <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">Community</span> Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who have transformed their lives with MicroLoan.
            </p>
          </div>
          <div className="relative">
            <div className="flex justify-center">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-12 rounded-3xl shadow-xl border border-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-6">{testimonials[activeTestimonial].avatar}</div>
                    <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-relaxed">
                      "{testimonials[activeTestimonial].content}"
                    </blockquote>
                    <div className="text-lg font-semibold text-slate-900 mb-2">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-slate-700 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                Building Financial <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">Bridges</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                MicroLoan is more than just a lending platform. We're creating a community where people can help each other achieve their dreams through trusted, transparent financial relationships.
              </p>
              <div className="space-y-6">
                {[
                  "Community verification system",
                  "Multiple loan categories",
                  "Secure payment processing",
                  "Real-time tracking",
                  "24/7 customer support",
                  "Global accessibility"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gradient-to-r from-slate-700 to-gray-800 w-8 h-8 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-700 mb-2">1500+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-700 mb-2">$750K+</div>
                    <div className="text-gray-600">Loans Funded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-600 mb-2">98%</div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-600 mb-2">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gray-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your <span className="text-amber-400">Journey</span>?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of people who are already building their dreams with MicroLoan.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="group bg-white text-slate-800 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              to="/login"
              className="group border-2 border-white text-white hover:bg-white hover:text-slate-800 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Get in <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help you succeed. Reach out to our friendly support team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📧",
                title: "Email Support",
                contact: "support@microloan.com",
                description: "Get help via email within 24 hours"
              },
              {
                icon: "📞",
                title: "Phone Support",
                contact: "+1 (555) 123-4567",
                description: "Call us anytime, we're here 24/7"
              },
              {
                icon: "💬",
                title: "Live Chat",
                contact: "Available Now",
                description: "Chat with our support team instantly"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{contact.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{contact.title}</h3>
                <p className="text-slate-700 font-medium mb-2">{contact.contact}</p>
                <p className="text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-300 to-gray-300 bg-clip-text text-transparent">
                MicroLoan
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Empowering communities through trusted financial relationships. Building bridges, one loan at a time.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['features', 'about', 'testimonials', 'contact'].map((section) => (
                  <li key={section}>
                    <button 
                      onClick={() => scrollToSection(section)} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Connect</h4>
              <div className="flex space-x-4">
                {[
                  { icon: "🐦", label: "Twitter" },
                  { icon: "📘", label: "Facebook" },
                  { icon: "💼", label: "LinkedIn" },
                  { icon: "📷", label: "Instagram" }
                ].map((social, index) => (
                  <button 
                    key={index}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 transform"
                    title={social.label}
                  >
                    <span className="text-2xl">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MicroLoan. All rights reserved. | Made with ❤️ for communities worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 