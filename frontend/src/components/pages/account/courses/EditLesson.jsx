import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

const EditLesson = ({ placeholder }) => {
  // Page Title
  useEffect(() => {
    document.title = "Smart Learn | Edit Lesson";
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm();
  const [chapters, setChapters] = useState();
  const params = useParams();

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  const onSubmit = (data) => {};

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
        if (result.status == 200) {
          setChapters(result.data);
        } else {
          toast.error("Something Went Wrong");
        }
      });
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-8">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Basic Information
                        </h4>

                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Chapter
                          </label>
                          <select className="form-select">
                            <option value="">Select a Chapter</option>
                            {chapters &&
                              chapters.map((chapter) => {
                                return (
                                  <option value={chapter.id} key={chapter.id}>
                                    {chapter.title}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Duration (Mins)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Duration"
                          />
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
                            onChange={(newContent) => {}}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Status
                          </label>
                          <select className="form-select">
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="freeLesson"
                              value={1}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="freeLesson"
                            >
                              Free Lesson
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary mt-4"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditLesson;
