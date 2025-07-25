import React, { useEffect, useState } from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";
import { useForm } from "react-hook-form";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";
import EditCover from "./EditCover";
import ManageChapter from "./ManageChapter";

const EditCourse = () => {
  // Page Title
  useEffect(() => {
    document.title = "Smart Learning | Edit Course";
  }, []);

  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);

  const {
    register,
    handleSubmit,
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
          // console.log(result);
          if (result.status === 200) {
            reset({
              title: result.data.title,
              category: result.data.category_id,
              level: result.data.level_id,
              language: result.data.language_id,
              description: result.data.description,
              sell_price: result.data.price,
              cross_price: result.data.cross_price,
            });

            setCourse(result.data);
          } else {
            console.log("Something is Wrong!");
          }
        });
    },
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
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
        setLoading(false);
        if (result.status === 200) {
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
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setCategories(result.categories);
          setLevels(result.levels);
          setLanguages(result.languages);
        } else {
          console.log("Something is Wrong!");
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
                    <div className="card border-0 shadow-lg">
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
                              required: "The title field is required",
                            })}
                            type="text"
                            className={`form-control ${
                              errors.title && "is-invalid"
                            }`}
                            placeholder="Title"
                            id="title"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="category">
                            Category
                          </label>
                          <select
                            {...register("category", {
                              required: "The category field is required",
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
                                  <option key={category.id} value={category.id}>
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
                          <label className="form-label" htmlFor="level">
                            Level
                          </label>
                          <select
                            {...register("level", {
                              required: "The level field is required",
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
                                  <option key={level.id} value={level.id}>
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
                          <label className="form-label" htmlFor="language">
                            Language
                          </label>
                          <select
                            {...register("language", {
                              required: "The language field is required",
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
                                  <option key={language.id} value={language.id}>
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
                          <label className="form-label" htmlFor="description">
                            Description
                          </label>
                          <textarea
                            {...register("description")}
                            className="form-control"
                            id="description"
                            placeholder="Description"
                            rows={5}
                          ></textarea>
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Sell Price
                          </label>
                          <input
                            {...register("sell_price", {
                              required: "The sell price field is required",
                            })}
                            type="text"
                            className={`form-control ${
                              errors.sell_price && "is-invalid"
                            }`}
                            placeholder="Sell Price"
                            id="sell-price"
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
                            className={`form-control`}
                            placeholder="Cross Price"
                            id="cross-price"
                          />
                        </div>

                        <button disabled={loading} className="btn btn-primary">
                          {loading === false ? "Update" : "Please Wait..."}
                        </button>
                      </div>
                    </div>
                  </form>

                  <ManageChapter course={course} params={params}/>
                </div>

                <div className="col-md-5">
                  <ManageOutcome />
                  <ManageRequirement />
                  <EditCover course={course} setCourse={setCourse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
