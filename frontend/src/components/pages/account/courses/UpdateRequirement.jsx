import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const UpdateRequirement = ({
  requirements,
  setRequirements,
  requirementData,
  handleClose,
  showRequirement,
}) => {
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
    await fetch(`${apiUrl}/requirements/${requirementData.id}`, {
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
          const updatedRequirements = requirements.map((requirement) =>
            requirement.id == result.data.id
              ? { ...requirement, text: result.data.text }
              : requirement
          );
          setRequirements(updatedRequirements);
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
    if (requirementData) {
      reset({
        requirement: requirementData.text,
      });
    }
  }, [requirementData]);

  return (
    <Modal size="lg" show={showRequirement} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Requirement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="requirement" className="form-label">
              Requirement
            </label>
            <input
              {...register("requirement", {
                required: "The Requirement Field is Required.",
              })}
              type="text"
              id="requirement"
              className={`form-control ${errors.requirement && "is-invalid"}`}
              placeholder="Requirement"
            />
            {errors.requirement && (
              <p className="invalid-feedback">{errors.requirement.message}</p>
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

export default UpdateRequirement;
