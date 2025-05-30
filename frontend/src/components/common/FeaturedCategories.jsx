import React from "react";
import { Link } from "react-router-dom";

const FeaturedCategories = () => {
  return (
    <section className="section-2">
      <div className="container">
        <div className="section-title py-3  mt-4">
          <h2 className="h3">Explore Categories</h2>
          <p>
            Discover categories designed to help you excel in your professional
            and personal growth.
          </p>
        </div>
        <div className="row gy-3">
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Web Development</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Mobile Development</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Digital Marketing</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Graphic Design</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Software Design</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Content Writing</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Fiance</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <Link to="">Graphic Design</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
