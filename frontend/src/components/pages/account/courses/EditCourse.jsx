import React from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const EditCourse = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/courses`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          toast.success(result.message);
          navigate("/account/courses/edit/" + result.data.id);
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Course
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Course Details
                        </h4>

                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Title
                          </label>
                          <input
                            {...register("title", {
                              required: "The Title Field is Required.",
                            })}
                            type="text"
                            id="title"
                            className={`form-control ${
                              errors.title && "is-invalid"
                            }`}
                            placeholder="Title"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category
                          </label>
                          <select className="form-select" id="category">
                            <option value="">Select a Category</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="level" className="form-label">
                            Level
                          </label>
                          <select className="form-select" id="level">
                            <option value="">Select a Level</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="language" className="form-label">
                            Language
                          </label>
                          <select className="form-select" id="language">
                            <option value="">Select a Language</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={5}
                            className="form-control"
                            placeholder="Description"
                          ></textarea>
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Sell Price
                          </label>
                          <input
                            {...register("title", {
                              required: "The Title Field is Required.",
                            })}
                            type="text"
                            id="sell-price"
                            className={`form-control ${
                              errors.title && "is-invalid"
                            }`}
                            placeholder="Sell Price"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Corss Price
                          </label>
                          <input
                            {...register("title", {
                              required: "The Title Field is Required.",
                            })}
                            type="text"
                            id="corss-price"
                            className={`form-control ${
                              errors.title && "is-invalid"
                            }`}
                            placeholder="Corss Price"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <button className="btn btn-primary">Update</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
