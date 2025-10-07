import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/outcomes`, {
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
    <div className="card shadow border-0">
      <div className="card-body">
        <div className="d-flex">
          <h4 className="h5 mb-3">Outcome</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              {...register("outcome", {
                required: "The Outcome Filed is Required.",
              })}
              type="text"
              className={`form-control ${errors.outcome && "is-invalid"}`}
              placeholder="Outcome"
            />
            {errors.outcome && (
              <p className="invalid-feedback">{errors.outcome.message}</p>
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

export default ManageOutcome;
