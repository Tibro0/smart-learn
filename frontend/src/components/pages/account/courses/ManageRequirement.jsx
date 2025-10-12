import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";

const ManageRequirement = () => {
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementData, setRequirementData] = useState([]);
  const params = useParams();

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

    await fetch(`${apiUrl}/requirements`, {
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
          const newRequirements = [...requirements, result.data];
          setRequirements(newRequirements);
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
    <>
      <div className="card shadow border-0 mt-4">
        <div className="card-body">
          <div className="d-flex">
            <h4 className="h5 mb-3">Requirement</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-3">
              <input
                {...register("requirement", {
                  required: "The Requirement Filed is Required.",
                })}
                type="text"
                className={`form-control ${errors.requirement && "is-invalid"}`}
                placeholder="Requirement"
              />
              {errors.requirement && (
                <p className="invalid-feedback">{errors.requirement.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? "Save" : "Please Wait.."}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageRequirement;
