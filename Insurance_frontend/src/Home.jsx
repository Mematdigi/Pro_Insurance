import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import umbrellaImg from '/public/family-life-insurance-illustration.png'; // ensure image is in public
import logo from '/Logo.png'; // Place logo in public folder
import { Link } from 'react-router-dom';

const insuranceServices = [
  "Life Insurance",
  "Health Insurance",
  "Travel Insurance",
  "Business Insurance",
  "Education Insurance",
  "Vehicle Insurance",
  "Home Insurance",
  "Child Insurance",
  "Retirement Plans",
  "Group Insurance"
];

const Home = () => {

  return (
    <>    
    {/* Header Section */}
    <header>
      {/* Top Strip */}
      <div className="d-flex justify-content-between align-items-center py-2 px-3 border-bottom flex-wrap bg-white">
        <div className="d-flex align-items-center gap-2">
          <img src={logo} alt="Logo" style={{ width: 40 }} />
          <h5 className="fw-bold mb-0">Insurin</h5>
        </div>

        <div className="text-center flex-grow-1 d-none d-md-block">
          <p className="mb-0 small text-dark">
            The Science Behind Strong Customer Relationships — new research out now! 🎉{' '}
            <a href="#" className="text-warning fw-bold">Read more</a>
          </p>
        </div>

        {/* Desktop Search, Mobile Login */}
        <div className="d-none d-md-block">
          <button className="btn btn-warning text-white fw-bold px-4">
            SEARCH <i className="fas fa-search ms-2"></i>
          </button>
        </div>

        <div className="d-block d-md-none  mt-2">
          <Link to="/login" className="btn btn-danger  fw-bold">Login</Link>
        </div>
       
      </div>

      {/* Nav Section */}
      <nav className="navbar navbar-expand-md bg-white py-2 border-bottom">
        <div className="container-fluid px-3">
          {/* Hotline */}
          <div className="d-flex align-items-center gap-2">
            <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
              <i className="fas fa-fire"></i>
            </div>
            <span className="text-success fw-medium">Hot Line: +1 800 123 456</span>
          </div>

          {/* Toggle for Mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div className="collapse navbar-collapse justify-content-center" id="mainNav">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-md-4 text-center">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/shop">Insurance</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/pages">Testimonials</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/blog">Contact us </Link></li>
            </ul>
          </div>

          {/* Desktop Login/Sign in */}
          <div className="d-none d-md-block">
            <Link to="/login" className="login_btn me-2">Login</Link>
            <Link to="/register" className="btn btn-danger  fw-bold">Register</Link>
          </div>
        </div>
      </nav>
    </header>

    <section className="banner-section container-fluid py-5 px-3 px-md-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <span className="badge text-success fw-bold mb-2">❤️ FROM $3.99/MO. 73% OFF</span>
          <h1 className="display-5 fw-bold">
            Insurance need make<br />
            <span className="highlight border-bottom border-warning border-3">Happier Life</span>
          </h1>
          <p className="text-muted mt-3">
            Solve your staffing challenges with our flexible workforce.<br />
            Stinters complete basic tasks when you need them.
          </p>
          <button className="btn btn-success mt-4 px-4 py-2 d-flex align-items-center">
            GET IN QUOTE <span className="ms-2 fs-5">→</span>
          </button>
        </div>

        <div className="col-md-6 text-center position-relative">
          <img src={umbrellaImg} alt="umbrella" className="img-fluid" />
        </div>
      </div>

    </section>

    {/* 🚀 Scrolling Strip Section */}
    <section className="insurance-strip">
    <div className="scrolling-text">
        {insuranceServices.map((service, idx) => (
        <span key={idx} className="service-item">
            ✦ {service}
        </span>
        ))}
        {/* Duplicate for seamless scrolling */}
        {insuranceServices.map((service, idx) => (
        <span key={`copy-${idx}`} className="service-item">
            ✦ {service}
        </span>
        ))}
    </div>
    </section>
    
    {/* 💼 Insurance Product Cards Section */}
    <section className="insurance-product-section container text-center py-5">
      <p className="text-success fw-bold mb-2">❤️ FROM $3.99/MO. 73% OFF</p>
      <h2 className="display-5 fw-bold mb-4">
        Hey, we're bloom. We bring together <br />
       years of within Products <span role="img" aria-label="fire">🔥</span>
      </h2>

      <div className="row g-4 mt-4">
        {[
          { title: "Health Insurance", icon: "/icons/icon2.png" },
          { title: "Business Insurance", icon: "/icons/icon6.png" },
          { title: "Delta Trust Insurance", icon: "/icons/icon4.png" },
          { title: "Baby Insurance", icon: "/icons/icon5.png" },
          { title: "Home Insurance", icon: "/icons/icon1.png" },
          { title: "Travel Insurance", icon: "/icons/icon3.png" },
        ].map((card, index) => (
          <div className="col-12 col-sm-6 col-md-4" key={index}>
            <div className="insurance-card p-4 h-100 text-center">
              <img
                src={card.icon}
                alt={card.title}
                className="mx-auto mb-3"
                style={{ width: 60, height: 60 }}
              />
              <h5 className="fw-bold">{card.title}</h5>
              <p className="text-muted small">With the right credit card</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* 💼 Statistics  Section */}
    <section className="insurance-feature-section text-white py-5 px-3 px-md-5">
        <div className="container">
            <div className="row align-items-center g-4">
            {/* Left Image */}
            <div className="col-md-6 text-center">
                <img src="/public/happy-family-with-umbrella.png" alt="insurance house" className="img-fluid" />
            </div>

            {/* Right Content */}
            <div className="col-md-6">
                <p className="text-uppercase text-warning fw-bold small mb-2">FROM $3.99/MO. 73% OFF</p>
                <h2 className="fw-bold display-6 mb-4">
                Insurance <span className="text-warning">makes</span> new Life <br /> needs
                </h2>

                <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                    <h6 className="fw-bold">Trust & Peace Of Mind</h6>
                    <p className="small text-light">Lorem ipsum, or lipsum as some known, is dummy text used</p>
                </div>
                <div className="col-sm-6 mb-3">
                    <h6 className="fw-bold">Superior Quality</h6>
                    <p className="small text-light">Lorem ipsum, or lipsum as some known, is dummy text used</p>
                </div>
                <div className="col-sm-6 mb-3">
                    <h6 className="fw-bold">Control Over Policy</h6>
                    <p className="small text-light">Lorem ipsum, or lipsum as some known, is dummy text used</p>
                </div>
                <div className="col-sm-6 mb-3">
                    <h6 className="fw-bold">Save Your Money</h6>
                    <p className="small text-light">Lorem ipsum, or lipsum as some known, is dummy text used</p>
                </div>
                </div>

                {/* Experience & Area Info */}
                <div className="d-flex gap-3 flex-wrap">
                <div className="stat-box p-3 rounded text-center">
                    <h4 className="fw-bold mb-1">10+</h4>
                    <p className="small mb-0">Experience</p>
                </div>
                <div className="stat-box p-3 rounded text-center">
                    <h4 className="fw-bold mb-1">215</h4>
                    <p className="small mb-0">square area</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>

    {/* 💼 Testimonial  Section */}
    <section className="testimonial-section py-5 px-3 px-md-5">
        <div className="container text-center">
            <p className="text-success fw-bold mb-2">❤️ FROM $3.99/MO. 73% OFF</p>
            <h2 className="fw-bold display-6 mb-3">Hey, we're bloom. We bring</h2>
            <p className="text-muted col-md-6 mx-auto mb-5">
            Proin in mauris scelerisque risus nisl cras. Non dui nec vitae nunc. Nulla platea urna in. 
            Vitae augue pulvinar vitae, platea risus est.
            </p>

            <div className="row g-4">
            {[
                { platform: "Trustpilot", logo: "/public/trustpilot-stars.jpg" },
                { platform: "Google", logo: "/public/trustpilot-stars.jpg" },
                { platform: "Trustpilot", logo: "/public/trustpilot-stars.jpg" }
            ].map((review, i) => (
                <div className="col-12 col-md-6 col-lg-4" key={i}>
                <div className="testimonial-card bg-white p-4 rounded shadow-sm h-100 text-start">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">{review.platform}</h6>
                    <span className="text-warning">
                        {"⭐".repeat(5)}
                    </span>
                    </div>
                    <img src={review.logo} alt={review.platform} style={{ height: 20 }} className="mb-3" />
                    <p className="text-muted">
                    Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. 
                    It will take you wherever you wish, but it will not replace you as the driver.
                    </p>
                    <div className="d-flex align-items-center mt-4">
                    <img src="/public/testimonial/testimonial2.jpg" alt="reviewer" className="rounded-circle me-3" width="40" height="40" />
                    <div>
                        <h6 className="fw-semibold mb-0">Cameron Williamson</h6>
                        <small className="text-muted">Ceo & Founder</small>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    </section>

    {/* 💼 Social Media Section */}
    <section className="social-section container py-5">
      <div className="row g-4 text-center">
          {[
          { name: "Facebook", icon: "/public/Social_media/icon3.png" },
          { name: "Linkedin", icon: "/public/Social_media/icon1.png" },
          { name: "Twitter", icon: "/public/Social_media/icon4.png" },
          { name: "Instagram", icon: "/public/Social_media/icon5.png" },
          { name: "Youtube", icon: "/public/Social_media/icon2.png" },
          { name: "Whats App", icon: "/public/Social_media/icon6.png" },
          ].map((social, index) => (
          <div className="col-6 col-md-4 col-lg-2" key={index}>
              <div className="social-box p-3 border text-center h-100">
              <img src={social.icon} alt={social.name} width="32" className="mb-2" />
              <div className="fw-semibold">{social.name}</div>
              </div>
          </div>
          ))}
      </div>
    </section>

           <footer className="footer-section text-white pt-5 pb-4">
      <div className="container">
        {/* Top: Logo & Subscribe */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-bottom pb-4 mb-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img src="/public/Logo.png" alt="logo" width="36" className="me-2" />
            <h4 className="mb-0 text-white fw-bold">Insurance</h4>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <input type="email" className="form-control" placeholder="Your email" />
            <button className="btn btn-success">Subscribe</button>
          </div>
        </div>

        {/* Middle: Columns */}
        <div className="row gy-4 text-white">
          {/* About */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold">About</h6>
            <p className="small">
              Lorem ipsum dolor sit amet consectetur diam ultricies leo etiam nibh tristique.
              Odio feugiat vitae libero vestibulum viverra elementum luctus.
            </p>
          </div>

          {/* Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold">Links</h6>
            <ul className="list-unstyled small">
              <li>About Us</li>
              <li>Services</li>
              <li>Case</li>
              <li>Request Pickup</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Working Hours</h6>
            <p className="small mb-1">Tincidunt neque pretium lectus donec risus.</p>
            <p className="small mb-1">Mon – Fri: 9:00AM – 6:00PM</p>
            <p className="small mb-0">Sat – Sun: 8:00AM – 4:00PM</p>
          </div>

          {/* Get In Touch */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold">Get In Touch</h6>
            <p className="small mb-1"><i className="fas fa-map-marker-alt me-2 text-success"></i> Add: New Hyde Park, NY 11040</p>
            <p className="small mb-1"><i className="fas fa-envelope me-2 text-success"></i> Email: example@info.com</p>
            <p className="small"><i className="fas fa-phone me-2 text-success"></i> Phone: 333 666 0000</p>

            <div className="d-flex gap-3 mt-3">
              <i className="fab fa-facebook-f social-icon"></i>
              <i className="fab fa-twitter social-icon"></i>
              <i className="fab fa-instagram social-icon"></i>
              <i className="fab fa-linkedin-in social-icon"></i>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="text-center pt-4 mt-4 border-top small text-light">
          Copyright © 2023 by About template All Right Reserved.
        </div>
      </div>
    </footer>
    </>
  );
};

export default Home;
