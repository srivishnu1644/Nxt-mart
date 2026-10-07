import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <p className="footer-query-text">For any queries, contact +91-9876543210</p>
    <p className="footer-query-text">or mail us help@nxtmart.co.in</p>
    <div className="footer-social-icons">
      <a href="https://facebook.com" className="social-icon-link">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841790/App_Logo_Inspiraton_42facebook.svg"
          alt="facebook"
          className="social-icon"
        />
      </a>
      <a href="https://pinterest.com" className="social-icon-link">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841790/App_Logo_Inspiraton_111pintrest.svg"
          alt="pinterest"
          className="social-icon"
        />
      </a>
      <a href="https://twitter.com" className="social-icon-link">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841787/Twitter_bird_logo_2012_1twitter.svg"
          alt="twitter"
          className="social-icon"
        />
      </a>
      <a href="https://instagram.com" className="social-icon-link">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841786/instagraminstagram.svg"
          alt="instagram"
          className="social-icon"
        />
      </a>
    </div>
    <p className="footer-copyright">
      Copyright © 2023 NxtMart Grocery Supplies Pvt Ltd
    </p>
  </footer>
)

export default Footer
