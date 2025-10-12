import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

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

  const [showRequirement, setShowRequirement] = useState(false);
  const handleClose = () => setShowRequirement(false);
  const handleShow = (requirement) => {
    setShowRequirement(true);
    setRequirementData(requirement);
  };

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

  const fetchRequirements = async () => {
    await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
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
          setRequirements(result.data);
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

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

          {requirements &&
            requirements.map((requirement) => {
              return (
                <div
                  key={`requirement-${requirement.id}`}
                  className="card shadow border-0 mb-2"
                >
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{requirement.text}</div>
                      <div className="d-flex">
                        <Link
                          onClick={() => handleShow(requirement)}
                          className="text-primary me-1"
                        >
                          <BsPencilSquare />
                        </Link>
                        <Link
                          onClick={() => deleteOutcome(requirement.id)}
                          className="text-danger"
                        >
                          <FaTrashAlt />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ManageRequirement;
