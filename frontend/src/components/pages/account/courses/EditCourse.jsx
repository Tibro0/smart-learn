import React, { useEffect, useState } from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const EditCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const params = useParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: async () => {
      await fetch(`${apiUrl}/courses/${params.id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            reset({
              title: result.data.title,
              category: result.data.category_id,
              level: result.data.level_id,
              language: result.data.language_id,
              description: result.data.description,
              sell_price: result.data.price,
              cross_price: result.data.cross_price,
            });
          } else {
            toast.error("Something Went Wrong!");
          }
        });
    },
  });

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/courses/${params.id}`, {
      method: "PUT",
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
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  const courseMetaData = async () => {
    await fetch(`${apiUrl}/courses/meta-data`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          setCategories(result.categories);
          setLevels(result.levels);
          setLanguages(result.languages);
        } else {
          toast.error("Something Went Wrong!");
        }
      });
  };

  useEffect(() => {
    courseMetaData();
  }, []);

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
                          <select
                            {...register("category", {
                              required: "Please Select a Category.",
                            })}
                            className={`form-select ${
                              errors.category && "is-invalid"
                            }`}
                            id="category"
                          >
                            <option value="">Select a Category</option>
                            {categories &&
                              categories.map((category) => {
                                return (
                                  <option value={category.id} key={category.id}>
                                    {category.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.category && (
                            <p className="invalid-feedback">
                              {errors.category.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="level" className="form-label">
                            Level
                          </label>
                          <select
                            {...register("level", {
                              required: "Please Select a Level.",
                            })}
                            className={`form-select ${
                              errors.level && "is-invalid"
                            }`}
                            id="level"
                          >
                            <option value="">Select a Level</option>
                            {levels &&
                              levels.map((level) => {
                                return (
                                  <option value={level.id} key={level.id}>
                                    {level.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.level && (
                            <p className="invalid-feedback">
                              {errors.level.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="language" className="form-label">
                            Language
                          </label>
                          <select
                            {...register("language", {
                              required: "Please Select a Language.",
                            })}
                            className={`form-select ${
                              errors.language && "is-invalid"
                            }`}
                            id="language"
                          >
                            <option value="">Select a Language</option>
                            {languages &&
                              languages.map((language) => {
                                return (
                                  <option value={language.id} key={language.id}>
                                    {language.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.language && (
                            <p className="invalid-feedback">
                              {errors.language.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <textarea
                            {...register("description")}
                            id="description"
                            rows={5}
                            className={`form-control`}
                            placeholder="Description"
                          ></textarea>
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Sell Price
                          </label>
                          <input
                            {...register("sell_price", {
                              required: "The Sell Price Field is Required.",
                            })}
                            type="text"
                            id="sell-price"
                            className={`form-control ${
                              errors.sell_price && "is-invalid"
                            }`}
                            placeholder="Sell Price"
                          />
                          {errors.sell_price && (
                            <p className="invalid-feedback">
                              {errors.sell_price.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="cross-price" className="form-label">
                            Cross Price
                          </label>
                          <input
                            {...register("cross_price")}
                            type="text"
                            id="cross-price"
                            className={`form-control ${
                              errors.cross_price && "is-invalid"
                            }`}
                            placeholder="Cross Price"
                          />
                          {errors.cross_price && (
                            <p className="invalid-feedback">
                              {errors.cross_price.message}
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
