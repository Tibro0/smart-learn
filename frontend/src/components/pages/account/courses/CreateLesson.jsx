import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const CreateLesson = ({ showLessonModel, handleCloseLessonModel, course }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await fetch(`${apiUrl}/lessons`, {
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
        setLoading(false);
        if (result.status == 200) {
          //setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
          toast.success(result.message);
          reset({
            chapter: "",
            lesson: "",
            status: 1,
          });
          handleCloseLessonModel();
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  return (
    <Modal size="lg" show={showLessonModel} onHide={handleCloseLessonModel}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="chapter" className="form-label">
              Chapter
            </label>
            <select
              {...register("chapter", {
                required: "Please Select a Chapter",
              })}
              className={`form-select ${errors.chapter && "is-invalid"}`}
              id="chapter"
            >
              <option value="">Select a Chapter</option>
              {course.chapters &&
                course.chapters.map((chapter) => {
                  return (
                    <option value={chapter.id} key={chapter.id}>
                      {chapter.title}
                    </option>
                  );
                })}
            </select>
            {errors.chapter && (
              <p className="invalid-feedback">{errors.chapter.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="lesson" className="form-label">
              Lesson
            </label>
            <input
              {...register("lesson", {
                required: "The Lesson Field is Required.",
              })}
              type="text"
              id="lesson"
              className={`form-control ${errors.lesson && "is-invalid"}`}
              placeholder="Lesson"
            />
            {errors.lesson && (
              <p className="invalid-feedback">{errors.lesson.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              {...register("status", {
                required: "Please Select a Status",
              })}
              className="form-select"
              id="status"
            >
              <option value="1" defaultValue={1}>
                Active
              </option>
              <option value="0">Block</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button disabled={loading} className="btn btn-primary">
            {loading == false ? "Save" : "Please Wait.."}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreateLesson;
