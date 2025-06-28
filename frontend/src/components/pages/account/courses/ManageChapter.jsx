import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";

const ManageChapter = ({ course, params }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTER":
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
        // console.log(result);
        setLoading(false);
        if (result.status === 200) {
          // const newOutcome = [...outcomes, result.data];
          // setOutcomes(newOutcome);
          setChapters({ type: "ADD_CHAPTER", payload: result.data });
          toast.success(result.message);
          reset();
        } else {
          console.log("Something is Wrong!");
        }
      });
  };

  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTER", payload: course.chapters });
    }
  }, [course]);

  return (
    <>
      <div className="card shadow-lg border-0 mt-4">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Chapters</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-3">
              <input
                {...register("chapter", {
                  required: "The chapter field is required.",
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
              {loading === false ? "Save" : "Please Wait..."}
            </button>
          </form>

          <Accordion>
            {chapters.map((chapter, index) => {
              return (
                <Accordion.Item eventKey={index}>
                  <Accordion.Header>{chapter.title}</Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>

          {/* <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Test</Accordion.Header>
              <Accordion.Body></Accordion.Body>
            </Accordion.Item>
          </Accordion> */}
        </div>
      </div>
    </>
  );
};

export default ManageChapter;
