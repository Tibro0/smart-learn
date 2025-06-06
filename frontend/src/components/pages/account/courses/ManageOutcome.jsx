import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { data, Link, useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";
import { MdDragIndicator } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import UpdateOutcome from "./UpdateOutcome";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomeData] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const params = useParams();

  const [showOutcome, setShowOutcome] = useState(false);
  const handleClose = () => setShowOutcome(false);
  const handleShow = (outcome) => {
    setShowOutcome(true);
    setOutcomeData(outcome);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(outcomes);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setOutcomes(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updateOutcomes) => {
    await fetch(`${apiUrl}/sort-outcomes`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ outcomes: updateOutcomes }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        if (result.status === 200) {
          toast.success(result.message);
        } else {
          console.log("Something is Wrong!");
        }
      });
  };

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
        // console.log(result);
        setLoading(false);
        if (result.status === 200) {
          const newOutcome = [...outcomes, result.data];
          setOutcomes(newOutcome);
          toast.success(result.message);
          reset();
        } else {
          console.log("Something is Wrong!");
        }
      });
  };

  const fetchOutcomes = async () => {
    await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setOutcomes(result.data);
        } else {
          console.log("Something is Wrong!");
        }
      });
  };

  const deleteOutcome = async (id) => {
    if (confirm("Are you sure you want to delete ?")) {
      await fetch(`${apiUrl}/outcomes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          setLoading(false);
          if (result.status === 200) {
            const newOutcomes = outcomes.filter((outcome) => outcome.id != id);
            setOutcomes(newOutcomes);
            toast.success(result.message);
          } else {
            console.log("Something is Wrong!");
          }
        });
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Outcome</h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-3">
              <input
                {...register("outcome", {
                  required: "The Outcome field is required.",
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
              {loading === false ? "Save" : "Please Wait..."}
            </button>
          </form>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {outcomes.map((outcome, index) => (
                    <Draggable
                      key={outcome.id}
                      draggableId={`${outcome.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border bg-white shadow-lg rounded border-0"
                        >
                          <div className="card-body p-2 d-flex">
                            <div>
                              <MdDragIndicator />
                            </div>
                            <div className="d-flex justify-content-between w-100">
                              <div className="ps-2">{outcome.text}</div>
                              <div className="d-flex">
                                <Link
                                  onClick={() => handleShow(outcome)}
                                  className="text-primary me-1"
                                >
                                  <FaPenToSquare />
                                </Link>
                                <Link
                                  onClick={() => deleteOutcome(outcome.id)}
                                  className="text-danger"
                                >
                                  <FaTrashAlt />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Modal Start */}
      <UpdateOutcome
        outcomeData={outcomeData}
        showOutcome={showOutcome}
        handleClose={handleClose}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
      {/* Modal End */}
    </>
  );
};

export default ManageOutcome;
