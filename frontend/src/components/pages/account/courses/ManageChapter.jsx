import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const ManageChapter = ({course, params}) => {
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

  return (
    <div className="card shadow border-0 mt-4">
      <div className="card-body">
        <div className="d-flex">
          <h4 className="h5 mb-3">Chapters</h4>
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
      </div>
    </div>
  );
};

export default ManageChapter;
