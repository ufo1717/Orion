export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cedrick-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-text">CEDRICK</span>
            <span className="logo-subtext">LOGGING</span>
          </div>
          <p className="footer-tagline">
            From Seedling to Solution.<br />
            The Cedrick Thomas Standard.
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Pacific Northwest, USA</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>(555) 123-TIMBER</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>contact@cedricklogging.com</span>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>For Landowners</h4>
            <a href="#stewardship">Stewardship Approach</a>
            <a href="#estimator">Harvest Estimator</a>
            <a href="#faq">FAQ</a>
            <a href="#testimonials">Landowner Stories</a>
          </div>
          <div className="link-column">
            <h4>For Lumber Buyers</h4>
            <a href="#products">Product Catalog</a>
            <a href="#mass-timber">Mass Timber / CLT</a>
            <a href="#certifications">Certifications</a>
            <a href="#sourcing">Sustainable Sourcing</a>
          </div>
          <div className="link-column">
            <h4>Company</h4>
            <a href="#about">About Cedrick</a>
            <a href="#team">Our Team</a>
            <a href="#careers">Careers</a>
            <a href="#news">News & Updates</a>
          </div>
        </div>
      </div>

      {/* Certifications Banner */}
      <div className="footer-certifications">
        <span className="cert-intro">Certified & Trusted:</span>
        <div className="cert-badges-footer">
          <div className="cert-badge-mini">
            <div className="badge-logo sfi">SFI</div>
            <span>Sustainable Forestry Initiative</span>
          </div>
          <div className="cert-badge-mini">
            <div className="badge-logo pefc">PEFC</div>
            <span>Programme for Forest Certification</span>
          </div>
          <div className="cert-badge-mini">
            <div className="badge-logo fsc">FSC</div>
            <span>Forest Stewardship Council</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-legal">
          <span>© {currentYear} Cedrick Logging. All rights reserved.</span>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility</a>
          </div>
        </div>
        <div className="footer-social">
          <a href="#linkedin" className="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
          </a>
          <a href="#instagram" className="social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/>
            </svg>
          </a>
          <a href="#facebook" className="social-link" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
