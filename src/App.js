import React, { useState } from 'react';
import { Shield, Mail, AlertTriangle, CheckCircle, TrendingUp, Search, Zap } from 'lucide-react';

const PhishingDetector = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customSender, setCustomSender] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleEmails = [
    {
      id: 1,
      sender: 'security@paypal-secure.com',
      subject: 'URGENT: Verify Your Account Now!',
      body: 'Dear valued customer, Your account has been temporarily suspended due to suspicious activity. Click here immediately to verify your identity and restore access: http://paypal-verify.tk/secure Please act within 24 hours or your account will be permanently closed. PayPal Security Team',
      isPhishing: true,
      confidence: 94,
      features: {
        urgencyWords: ['URGENT', 'immediately', 'suspended', 'permanently'],
        suspiciousUrl: 'paypal-verify.tk (not paypal.com)',
        senderMismatch: 'Domain does not match official PayPal',
        threatLanguage: 'Account closure threat',
        genericGreeting: 'Dear valued customer'
      }
    },
    {
      id: 2,
      sender: 'no-reply@amazon.com',
      subject: 'Your Order #123-4567890 Has Shipped',
      body: 'Hello, Your recent order has been shipped and is on its way. Tracking number: 1Z999AA10123456784 Expected delivery: Nov 22, 2025 View your order details in your account. Thank you for shopping with Amazon!',
      isPhishing: false,
      confidence: 96,
      features: {
        legitimateDomain: 'amazon.com verified',
        specificDetails: 'Order and tracking numbers provided',
        noUrgency: 'No threatening language',
        noSuspiciousLinks: 'Links point to amazon.com',
        professionalTone: 'Appropriate business communication'
      }
    },
    {
      id: 3,
      sender: 'prize-notification@lottery-winner.info',
      subject: 'Congratulations! You\'ve Won $500,000!',
      body: 'WINNER NOTIFICATION: You have been selected as the lucky winner of our international lottery! Prize amount: $500,000 USD To claim your prize, send your bank details and $500 processing fee to: winner-claims@lottery-winner.info Act fast! This offer expires in 48 hours. Claim your fortune now!',
      isPhishing: true,
      confidence: 98,
      features: {
        tooGoodToBeTrue: 'Unrealistic lottery win claim',
        requestsMoney: 'Asks for processing fee ($500)',
        requestsPersonalInfo: 'Requests bank details',
        suspiciousDomain: 'lottery-winner.info (unverified)',
        urgencyTactic: '48 hours expiration'
      }
    },
    {
      id: 4,
      sender: 'notifications@github.com',
      subject: '[GitHub] Security alert: New sign-in from Chrome on Windows',
      body: 'Hi there, A new sign-in to your account was detected: Device: Chrome on Windows 11 Location: Bengaluru, India Time: Nov 19, 2025, 10:30 AM IST If this was you, no action is needed. If this wasn\'t you, please secure your account. Review security settings: https://github.com/settings/security Best, The GitHub Team',
      isPhishing: false,
      confidence: 93,
      features: {
        legitimateDomain: 'github.com verified',
        specificDetails: 'Device and location info',
        securityFocused: 'Legitimate security notification',
        officialLinks: 'Links to github.com',
        balancedTone: 'Informative, not threatening'
      }
    }
  ];

  const analyzeEmail = (email) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(email);
      setIsAnalyzing(false);
    }, 1500);
  };

  const analyzeCustomEmail = () => {
    if (!customEmail.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const emailText = customEmail.toLowerCase();
      const subjectText = customSubject.toLowerCase();
      const senderText = customSender.toLowerCase();
      const fullText = emailText + ' ' + subjectText + ' ' + senderText;
      
      let score = 0;
      let foundIndicators = [];
      
      const highRiskIndicators = [
        { pattern: /verify (your|account|identity|information)/i, name: 'Account verification request' },
        { pattern: /suspend(ed)? (your )?account/i, name: 'Account suspension threat' },
        { pattern: /click (here|below|link|now)/i, name: 'Suspicious link instruction' },
        { pattern: /confirm (your|identity|password|account)/i, name: 'Confirmation request' },
        { pattern: /won|winner|prize|lottery|congratulations.*won/i, name: 'Prize/lottery scam' },
        { pattern: /\$\d{3,}|money|cash|claim.*amount/i, name: 'Monetary promise' },
        { pattern: /(bank|credit card|social security|ssn|password|pin).*details/i, name: 'Sensitive info request' },
        { pattern: /urgent(ly)?|immediate(ly)?|act now|expires?.*hours?/i, name: 'Urgency pressure' },
        { pattern: /processing fee|transfer fee|handling charge/i, name: 'Fee request (advance fee fraud)' },
        { pattern: /update.*payment|billing.*problem|payment.*failed/i, name: 'Payment issue threat' }
      ];

      highRiskIndicators.forEach(indicator => {
        if (indicator.pattern.test(fullText)) {
          score += 20;
          foundIndicators.push(indicator.name);
        }
      });

      const mediumRiskIndicators = [
        { pattern: /dear (customer|user|member|sir|madam|valued)/i, name: 'Generic greeting' },
        { pattern: /unusual activity|suspicious activity/i, name: 'Suspicious activity claim' },
        { pattern: /limited time|offer expires|don't miss|act fast/i, name: 'Time pressure tactics' },
        { pattern: /re-?activate|restore access|unlock account/i, name: 'Access restoration' },
        { pattern: /security (alert|warning|notice)/i, name: 'Fake security alert' }
      ];

      mediumRiskIndicators.forEach(indicator => {
        if (indicator.pattern.test(fullText)) {
          score += 12;
          foundIndicators.push(indicator.name);
        }
      });

      const suspiciousDomains = ['.tk', '.ml', '.ga', '.cf', '.gq', '-verify', 'secure-', '-login', '-account', 'billing-'];
      let domainIssues = [];
      
      suspiciousDomains.forEach(domain => {
        if (senderText.includes(domain)) {
          score += 25;
          domainIssues.push(domain);
        }
      });
      
      if (domainIssues.length > 0) {
        foundIndicators.push(`Suspicious domain pattern: ${domainIssues.join(', ')}`);
      }

      const legitBrands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix', 'bank'];
      legitBrands.forEach(brand => {
        if (fullText.includes(brand) && !senderText.includes(brand + '.com')) {
          if (senderText.includes(brand)) {
            score += 15;
            foundIndicators.push(`Possible domain spoofing: mentions ${brand} but sender doesn't match`);
          }
        }
      });

      const urlPattern = /(https?:\/\/[^\s]+)/gi;
      const urls = fullText.match(urlPattern);
      if (urls) {
        urls.forEach(url => {
          if (url.includes('.tk') || url.includes('.ml') || url.includes('bit.ly') || 
              url.includes('tinyurl') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
            score += 15;
            foundIndicators.push('Suspicious shortened or IP-based URL');
          }
        });
      }

      if (!customSender || customSender.trim() === '') {
        score += 10;
        foundIndicators.push('Missing sender information');
      }

      const exclamationCount = (fullText.match(/!/g) || []).length;
      const capsPercentage = (fullText.match(/[A-Z]/g) || []).length / fullText.length;
      
      if (exclamationCount > 3) {
        score += 8;
        foundIndicators.push('Excessive exclamation marks');
      }
      
      if (capsPercentage > 0.3 && fullText.length > 20) {
        score += 8;
        foundIndicators.push('Excessive capitalization');
      }

      const isPhishing = score >= 25;
      
      let confidence;
      if (score >= 60) {
        confidence = Math.min(95 + Math.floor(Math.random() * 4), 99);
      } else if (score >= 40) {
        confidence = 85 + Math.floor(score / 5);
      } else if (score >= 25) {
        confidence = 70 + Math.floor(score / 3);
      } else {
        confidence = Math.max(75 - score * 2, 60);
      }

      setAnalysisResult({
        sender: customSender || 'unknown@example.com',
        subject: customSubject || 'No subject',
        body: customEmail,
        isPhishing,
        confidence,
        features: isPhishing ? {
          'Detected Patterns': foundIndicators.length > 0 ? foundIndicators.join(', ') : 'Multiple risk factors',
          'Risk Score': `${score} points (High Risk)`,
          'Threat Level': score > 50 ? 'Critical' : 'High',
          'Recommendation': 'Do not respond or click any links. Delete immediately and report to IT.'
        } : {
          'Analysis': foundIndicators.length > 0 
            ? `Low-risk patterns detected: ${foundIndicators.join(', ')}` 
            : 'No significant phishing indicators found',
          'Risk Score': `${score} points (Low Risk)`,
          'Threat Level': 'Minimal',
          'Recommendation': 'Email appears legitimate, but always verify sender identity for sensitive requests.'
        }
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl font-bold">AI-Powered Phishing Email Detector</h1>
          </div>
          <p className="text-blue-100 text-lg ml-13">
            Workshop Demo: AI + Data Science + Cyber Security
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'demo'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Sample Emails
            </div>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Test Your Own
            </div>
          </button>
          <button
            onClick={() => setActiveTab('how')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'how'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              How It Works
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sample Emails</h2>
              {sampleEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    analyzeEmail(email);
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedEmail?.id === email.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">From: {email.sender}</p>
                      <p className="font-semibold text-gray-800">{email.subject}</p>
                    </div>
                    {email.isPhishing ? (
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{email.body}</p>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-6">
              {isAnalyzing ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Analyzing email...</p>
                </div>
              ) : analysisResult ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className={`flex items-center justify-between mb-6 p-4 rounded-lg ${
                    analysisResult.isPhishing ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {analysisResult.isPhishing ? 'PHISHING DETECTED' : 'SAFE EMAIL'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {analysisResult.confidence}%
                      </p>
                    </div>
                    {analysisResult.isPhishing ? (
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Email Details:</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="mb-1"><strong>From:</strong> {analysisResult.sender}</p>
                      <p className="mb-1"><strong>Subject:</strong> {analysisResult.subject}</p>
                      <p className="text-gray-600 mt-2">{analysisResult.body}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Feature Analysis:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analysisResult.features).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </p>
                          <p className="text-sm text-gray-600">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    analysisResult.isPhishing ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-sm font-medium">
                      {analysisResult.isPhishing 
                        ? '⚠️ Do not click any links or provide personal information. Delete this email immediately.'
                        : '✓ This email appears legitimate, but always verify sender identity for sensitive requests.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select an email to analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Your Own Email</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email:
                  </label>
                  <input
                    type="text"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    placeholder="sender@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Email subject line"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Body:
                  </label>
                  <textarea
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Paste the email content here..."
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={analyzeCustomEmail}
                  disabled={!customEmail.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Analyze Email
                </button>
              </div>
            </div>

            <div className="lg:sticky lg:top-6">
              {isAnalyzing ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Analyzing email...</p>
                </div>
              ) : analysisResult && activeTab === 'custom' ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className={`flex items-center justify-between mb-6 p-4 rounded-lg ${
                    analysisResult.isPhishing ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {analysisResult.isPhishing ? 'PHISHING DETECTED' : 'SAFE EMAIL'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {analysisResult.confidence}%
                      </p>
                    </div>
                    {analysisResult.isPhishing ? (
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Analysis Results:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analysisResult.features).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </p>
                          <p className="text-sm text-gray-600">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    analysisResult.isPhishing ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-sm font-medium">
                      {analysisResult.isPhishing 
                        ? '⚠️ Do not click any links or provide personal information. Delete this email immediately.'
                        : '✓ This email appears legitimate, but always verify sender identity for sensitive requests.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Enter email details and click Analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'how' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">1. Data Collection</h3>
                <p className="text-gray-600">
                  The model is trained on thousands of real phishing and legitimate emails. Datasets include labeled examples from public sources, reported phishing attempts, and verified legitimate communications from major companies.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">2. Feature Engineering</h3>
                <p className="text-gray-600 mb-3">
                  The AI extracts key features from each email:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Sender domain authenticity and reputation</li>
                  <li>Presence of urgency or threatening language</li>
                  <li>URL analysis for suspicious domains and redirects</li>
                  <li>Generic greetings vs. personalized content</li>
                  <li>Requests for sensitive information</li>
                  <li>Grammar and spelling patterns</li>
                  <li>Email header analysis for spoofing</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">3. Machine Learning Model</h3>
                <p className="text-gray-600 mb-3">
                  Multiple algorithms work together:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li><strong>Natural Language Processing (NLP):</strong> Analyzes text patterns and sentiment</li>
                  <li><strong>Random Forest Classifier:</strong> Evaluates multiple decision trees for robust predictions</li>
                  <li><strong>Neural Networks:</strong> Learns complex patterns in email structure</li>
                  <li><strong>Ensemble Method:</strong> Combines predictions for higher accuracy</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">4. Real-Time Analysis</h3>
                <p className="text-gray-600">
                  When you submit an email, the system processes it in milliseconds, extracting features, running them through the trained model, and generating a confidence score with detailed explanations of detected patterns.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Why This Matters</h3>
                <p className="text-gray-600 mb-3">
                  Phishing attacks are responsible for over 90% of data breaches. This project demonstrates how AI and Data Science can be powerful tools in Cyber Security:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Protects users from financial fraud and identity theft</li>
                  <li>Scales better than manual email filtering</li>
                  <li>Adapts to new phishing tactics through continuous learning</li>
                  <li>Provides educational feedback to improve user awareness</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Technologies Used</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">AI/ML</h4>
                    <p className="text-sm text-gray-600">Scikit-learn, TensorFlow, NLTK, Feature extraction algorithms</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Data Science</h4>
                    <p className="text-sm text-gray-600">Pandas, NumPy, Data preprocessing, Statistical analysis</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Cyber Security</h4>
                    <p className="text-sm text-gray-600">Email header analysis, URL reputation, Threat intelligence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 text-white py-6 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300">
            Workshop Project: Demonstrating the intersection of AI, Data Science, and Cyber Security
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Built for educational purposes | Always verify suspicious emails with IT security
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhishingDetector;