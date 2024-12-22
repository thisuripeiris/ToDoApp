import React, { useEffect, useState } from "react";
import { auth, db } from "./Config/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import Task from "./models/task";



export default function Modal({ id, task, onSave, onClose }) {
    // console.log("Task in Modal:", task);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        if (task) {
            setTaskData({ title: task.title, description: task.description });
        } else {
            setTaskData({ title: "", description: "" });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (task) {
            onSave(taskData); // Update task
        } else {
            try {
                const user = auth.currentUser;

                if (!user) {
                    toast.error("User not logged in!");
                    return;
                }

                const userRef = doc(db, "Users", user.uid); // Ref to the user doc
                const tasksCollectionRef = collection(userRef, "tasks"); // Sub-collection 'tasks'
                var taskObj = new Task(
                    {
                        title: taskData.title,
                        description: taskData.description,
                        createdAt: serverTimestamp(),
                    }

                );
                console.log("Task: " + taskObj.toJSON());
                await addDoc(tasksCollectionRef, taskObj.toJSON());

                toast.success("Task added successfully!");
                setTaskData({ title: "", description: "" }); // Reset form
            } catch (error) {
                console.error("Error adding task:", error);
                toast.error("Failed to add task.");
            }
        }

    };

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="taskModalLabel">
                            {task ? "Edit Task" : "New Task"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="col-form-label">Title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title-name"
                                    name="title"
                                    value={taskData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description-text" className="col-form-label">Description:</label>
                                <textarea
                                    className="form-control"
                                    id="description-text"
                                    name="description"
                                    value={taskData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                {task ? "UPDATE" : "ADD"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
