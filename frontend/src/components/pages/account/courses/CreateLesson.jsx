import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const CreateLesson = ({ showLessonModel, handleCloseLessonModel, course }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
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
        // console.log(result);
        setLoading(false);
        if (result.status === 200) {
          // setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
          toast.success(result.message);
          reset({
            chapter: "",
            lesson: "",
            status: 1,
          });
          handleCloseLessonModel();
        } else {
          console.log("Something is Wrong!");
        }
      });
  };

  return (
    <>
      <Modal size="lg" show={showLessonModel} onHide={handleCloseLessonModel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Chapter
              </label>
              <select
                {...register("chapter", {
                  required: "Please Select a Chapter",
                })}
                className={`form-select ${errors.chapter && "is-invalid"}`}
              >
                <option value="">Select a Chapter</option>
                {course.chapters &&
                  course.chapters.map((chapter) => {
                    return <option value={chapter.id}>{chapter.title}</option>;
                  })}
              </select>
              {errors.chapter && (
                <p className="invalid-feedback">{errors.chapter.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Lesson
              </label>
              <input
                {...register("lesson", {
                  required: "The lesson field is required",
                })}
                type="text"
                className={`form-control ${errors.lesson && "is-invalid"}`}
                placeholder="Lesson"
              />
              {errors.lesson && (
                <p className="invalid-feedback">{errors.lesson.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Status
              </label>
              <select
                {...register("status", {
                  required: "The status field is required",
                })}
                className="form-select"
              >
                <option value="1" selected>
                  Active
                </option>
                <option value="0">Block</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button disabled={loading} className="btn btn-primary">
              {loading === false ? "Save" : "Please Wait..."}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CreateLesson;
