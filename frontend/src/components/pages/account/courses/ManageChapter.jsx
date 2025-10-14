import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { Accordion } from "react-bootstrap";
import UpdateChapter from "./UpdateChapter";
import CreateLesson from "./CreateLesson";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";

const ManageChapter = ({ course, params }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState([]);

  // Update Chapter Model
  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setShowChapter(true);
    setChapterData(chapter);
  };

  // Create Lesson Model
  const [showLessonModel, setShowLessonModel] = useState(false);
  const handleCloseLessonModel = () => setShowLessonModel(false);
  const handleShowLessonModel = () => {
    setShowLessonModel(true);
  };

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTER":
        return [...state, action.payload];
      case "UPDATE_CHAPTER":
        return state.map((chapter) => {
          if (chapter.id === action.payload.id) {
            return action.payload;
          }
          return chapter;
        });
      case "DELETE_CHAPTER":
        return state.filter((chapter) => chapter.id != action.payload);
      default:
        return state;
    }
  };

  const [chapters, setChapters] = useReducer(chapterReducer, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/chapters`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          //const newOutcomes = [...outcomes, result.data];
          //setOutcomes(newOutcomes);
          setChapters({ type: "ADD_CHAPTER", payload: result.data });
          toast.success(result.message);
          reset();
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  const deleteChapter = async (id) => {
    if (confirm("Are You Sure You Want To Delete?")) {
      await fetch(`${apiUrl}/chapters/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            setChapters({ type: "DELETE_CHAPTER", payload: id });
            toast.success(result.message);
          } else {
            toast.error("Something Went Wrong!");
          }
        });
    }
  };

  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
  }, [course]);

  return (
    <>
      <div className="card shadow border-0 mt-4">
        <div className="card-body">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <h4 className="h5 mb-3">Chapters</h4>
              <Link onClick={() => handleShowLessonModel()}>
                <FaPlus size={12} className="mb-1" />{" "}
                <strong>Add Lesson</strong>
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-3">
              <input
                {...register("chapter", {
                  required: "The Chapter Filed is Required.",
                })}
                type="text"
                className={`form-control ${errors.chapter && "is-invalid"}`}
                placeholder="Chapter"
              />
              {errors.chapter && (
                <p className="invalid-feedback">{errors.chapter.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? "Save" : "Please Wait.."}
            </button>
          </form>

          <Accordion>
            {chapters.map((chapter, index) => {
              return (
                <Accordion.Item eventKey={index} key={chapter.id}>
                  <Accordion.Header>{chapter.title}</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between mb-2 mt-4">
                          <h4 className="h5">Lesson</h4>
                          <a href="" className="h6" data-discover="true">
                            <strong>Reorder Lessons</strong>
                          </a>
                        </div>
                      </div>
                      <div className="col-md-12">
                        {chapter.lessons &&
                          chapter.lessons.map((lesson) => {
                            return (
                              <div className="card shadow px-3 py-2 mb-2" key={lesson.id}>
                                <div className="row">
                                  <div className="col-md-7">{lesson.title}</div>
                                  <div className="col-md-5 text-end">
                                    {lesson.duration > 0 && (
                                      <small className="fw-bold text-muted me-2">
                                        20 Min
                                      </small>
                                    )}

                                    {lesson.is_free_preview == "yes" && (
                                      <span className="badge bg-success">
                                        Preview
                                      </span>
                                    )}

                                    <Link className="ms-2">
                                      <BsPencilSquare />
                                    </Link>
                                    <Link className="ms-2 text-danger">
                                      <FaTrashAlt />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="d-flex">
                          <button
                            onClick={() => deleteChapter(chapter.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete Chapter
                          </button>
                          <button
                            onClick={() => handleShow(chapter)}
                            className="btn btn-primary btn-sm ms-2"
                          >
                            Update Chapter
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </div>

      <UpdateChapter
        chapterData={chapterData}
        showChapter={showChapter}
        handleClose={handleClose}
        setChapters={setChapters}
      />

      <CreateLesson
        showLessonModel={showLessonModel}
        handleCloseLessonModel={handleCloseLessonModel}
        course={course}
      />
    </>
  );
};

export default ManageChapter;
