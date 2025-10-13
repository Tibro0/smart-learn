import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const UpdateChapter = ({ chapterData, showChapter, handleClose, setChapters }) => {
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
    await fetch(`${apiUrl}/chapters/${chapterData.id}`, {
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
        if (result.status == 200) {
          setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
          toast.success(result.message);
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  useEffect(() => {
    if (chapterData) {
      reset({
        chapter: chapterData.title,
      });
    }
  }, [chapterData]);

  return (
    <Modal size="lg" show={showChapter} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="chapter" className="form-label">
              Chapter
            </label>
            <input
              {...register("chapter", {
                required: "The Chapter Field is Required.",
              })}
              type="text"
              id="chapter"
              className={`form-control ${errors.chapter && "is-invalid"}`}
              placeholder="Chapter"
            />
            {errors.chapter && (
              <p className="invalid-feedback">{errors.chapter.message}</p>
            )}
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

export default UpdateChapter;
