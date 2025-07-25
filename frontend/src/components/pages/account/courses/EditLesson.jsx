import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import { Link, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import LessonVideo from "./LessonVideo";

const EditLesson = ({ placeholder }) => {
  useEffect(() => {
    document.title = "Smart Learning | Edit Lesson";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [chapters, setChapters] = useState();
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState([]);
  const params = useParams();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [checked, setChecked] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  const onSubmit = (data) => {
    data.description = content;
    setLoading(true)
    fetch(`${apiUrl}/lessons/${params.id}`, {
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
        setLoading(false)
        if (result.status === 200) {
          toast.success(result.message);
        } else {
          console.log("Something Went Wrong!");
        }
      });

    // data.description = content;
    // console.log(data);
  };

  useEffect(() => {
    fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
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
          setChapters(result.data);
        } else {
          console.log("Something Went Wrong!");
        }
      });

    // fetch lesson data
    fetch(`${apiUrl}/lessons/${params.id}`, {
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
          setLesson(result.data);
          reset({
            lesson: result.data.title,
            chapter_id: result.data.chapter_id,
            status: result.data.status,
            duration: result.data.duration,
          });
          setContent(result.data.description);
          setChecked(result.data.is_free_preview == "yes" ? true : false);
        } else {
          console.log("Something Went Wrong!");
        }
      });
  }, []);

  return (
    <>
      <Layout>
        <section className="section-4">
          <div className="container pb-5 pt-3">
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
                  <Link className="btn btn-primary" to={`/account/courses/edit/${params.courseId}`}>Back</Link>
                </div>
              </div>
              <div className="col-lg-3 account-sidebar">
                <UserSidebar />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-md-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="card border-0 shadow-lg">
                        <div className="card-body p-4">
                          <h4 className="h5 border-bottom pb-3 mb-3">
                            Basic Information
                          </h4>

                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Title
                            </label>
                            <input
                              {...register("lesson", {
                                required: "The title field is required.",
                              })}
                              type="text"
                              className={`form-control ${errors.lesson && 'is-invalid'}`}
                              placeholder="Title"
                            />
                            {
                              errors.lesson && <p className="invalid-feedback">{errors.lesson.message}</p>
                            }
                          </div>

                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Chapter
                            </label>
                            <select
                              {...register("chapter_id", {
                                required: "Please select a chapter",
                              })}
                              className={`form-select ${errors.chapter_id && 'is-invalid'}`}
                            >
                              <option value="">Select a Chapter</option>
                              {chapters &&
                                chapters.map((chapter) => {
                                  return (
                                    <option key={chapter.id} value={chapter.id}>
                                      {chapter.title}
                                    </option>
                                  );
                                })}
                            </select>
                            {
                              errors.chapter_id && <p className="invalid-feedback">{errors.chapter_id.message}</p>
                            }
                          </div>

                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Duration(Mins)
                            </label>
                            <input
                              {...register("duration", {
                                required: "The duration field is required.",
                              })}
                              type="number"
                              className={`form-control ${errors.duration && 'is-invalid'}`}
                              placeholder="Duration"
                            />
                            {
                              errors.duration && <p className="invalid-feedback">{errors.duration.message}</p>
                            }
                          </div>

                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Description
                            </label>
                            <JoditEditor
                              ref={editor}
                              value={content}
                              config={config}
                              tabIndex={1}
                              onBlur={(newContent) => setContent(newContent)}
                              onChange={(newContent) => { }}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Status
                            </label>
                            <select
                              {...register("status", {
                                required: "Please select a status",
                              })}
                              className="form-select"
                            >
                              <option value="1">Active</option>
                              <option value="0">Block</option>
                            </select>
                          </div>

                          <div className="d-flex">
                            <input
                              {...register("free_preview")}
                              checked={checked}
                              onChange={(e) => setChecked(e.target.checked)}
                              className="form-check-input"
                              type="checkbox"
                              id="freeLesson"
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="freeLesson"
                            >
                              Free Lesson
                            </label>
                          </div>
                          <button disabled={loading} className="btn btn-primary mt-3">
                            {loading === false ? "Update" : "Please Wait..."}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-4">
                    <LessonVideo lesson={lesson} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default EditLesson;
