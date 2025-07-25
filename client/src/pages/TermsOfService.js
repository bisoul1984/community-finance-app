import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
              <p className="text-lg text-gray-600">Please read these terms carefully before using our platform</p>
            </div>
            <Link 
              to="/" 
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="prose prose-slate max-w-none">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mb-8">
              <p className="text-gray-700 mb-0">
                <strong>Last updated:</strong> January 2024
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                1. Acceptance of Terms
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using the MicroLoan platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                2. Description of Service
              </h2>
              <p className="text-gray-600 mb-6">MicroLoan provides a peer-to-peer lending platform that connects borrowers with lenders. Our services include:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li>Loan application and processing</li>
                  <li>Credit assessment and verification</li>
                  <li>Payment processing and management</li>
                </ul>
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li>Customer support and communication</li>
                  <li>Platform security and fraud prevention</li>
                  <li>Financial education and resources</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                3. User Eligibility
              </h2>
              <p className="text-gray-600 mb-6">To use our services, you must:</p>
              <div className="bg-green-50 rounded-xl p-6">
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li>Be at least 18 years old</li>
                  <li>Have legal capacity to enter into contracts</li>
                  <li>Provide accurate and complete information</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not be prohibited from using financial services</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                4. User Responsibilities
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Borrowers
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Provide accurate and truthful information</li>
                    <li>Make timely payments as agreed</li>
                    <li>Maintain current contact information</li>
                    <li>Notify us of any changes in circumstances</li>
                    <li>Use loan funds for stated purposes only</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Lenders
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Fund loans only with available capital</li>
                    <li>Understand the risks of peer-to-peer lending</li>
                    <li>Comply with applicable investment regulations</li>
                    <li>Maintain accurate account information</li>
                    <li>Diversify investments appropriately</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                5. Prohibited Activities
              </h2>
              <p className="text-gray-600 mb-6">You agree not to:</p>
              <div className="bg-red-50 rounded-xl p-6">
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li>Provide false or misleading information</li>
                  <li>Use the platform for illegal purposes</li>
                  <li>Attempt to circumvent security measures</li>
                  <li>Interfere with platform operations</li>
                  <li>Harass or abuse other users</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                6. Fees and Charges
              </h2>
              <p className="text-gray-600 mb-6">Our fee structure includes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900">Origination fees</h3>
                    <p className="text-gray-600">Charged when loans are funded</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900">Service fees</h3>
                    <p className="text-gray-600">Monthly account maintenance fees</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900">Late payment fees</h3>
                    <p className="text-gray-600">Applied to overdue payments</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900">Processing fees</h3>
                    <p className="text-gray-600">For payment processing services</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-gray-700"><strong>Note:</strong> All fees are clearly disclosed before loan approval.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                7. Privacy and Data Protection
              </h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform, to understand our practices regarding the collection and use of your information.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                8. Disclaimers and Limitations
              </h2>
              <p className="text-gray-600 mb-6">We provide our services "as is" and make no warranties about:</p>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li>The accuracy of credit assessments</li>
                  <li>The likelihood of loan repayment</li>
                  <li>Platform availability or performance</li>
                  <li>The suitability of loans for your needs</li>
                  <li>Investment returns or financial outcomes</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                9. Termination
              </h2>
              <div className="bg-red-50 rounded-xl p-6">
                <p className="text-gray-600 leading-relaxed">
                  We may terminate or suspend your account at any time for violations of these terms. You may also terminate your account by contacting our support team. Outstanding obligations remain in effect after termination.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                10. Contact Information
              </h2>
              <p className="text-gray-600 mb-6">For questions about these Terms of Service, contact us:</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <p className="text-gray-600">fikertetadesse1403@gmail.com</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+251967044111</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                    <p className="text-gray-600">MicroLoan Support Team</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 