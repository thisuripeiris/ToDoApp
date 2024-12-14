import React, { useState } from "react";
import { auth, db } from "./Config/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Modal() {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;

            if (!user) {
                toast.error("User not logged in!");
                return;
            }

            const userRef = doc(db, "Users", user.uid); // Ref to the user doc
            const tasksCollectionRef = collection(userRef, "tasks"); // Sub-collection 'tasks'

            await addDoc(tasksCollectionRef, {
                title: taskData.title,
                description: taskData.description,
                createdAt: serverTimestamp(),
            });

            toast.success("Task added successfully!");
            setTaskData({ title: "", description: "" }); // Reset form
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task.");
        }
    };

    return (
        <div className="modal fade" id="taskModal" tabIndex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="taskModalLabel">New Task</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">ADD</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
