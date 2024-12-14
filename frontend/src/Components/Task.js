import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { doc, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Task.css';
import TaskDeleteModal from "../TaskDeleteModal";

export default function Task() {
    const [tasks, setTasks] = useState([]); // add task
    const [loading, setLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState(null); // delete task
    const navigate = useNavigate();

    // Fetch Data
    const fetchTasks = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userRef = doc(db, "Users", user.uid); // Ref to user ID
                const tasksCollectionRef = collection(userRef, "tasks"); // Ref to tasks collection

                // order by createdAt
                const tasksQuery = query(tasksCollectionRef, orderBy("createdAt", "desc"));

                // Listen to real-time updates
                const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
                    const fetchedTasks = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTasks(fetchedTasks);
                    setLoading(false);
                });

                return unsubscribe;
            } else {
                console.log("User is not logged in");
                setTasks([]);
                setLoading(false);
                navigate("/", { replace: true });
            }
        });
    };

    // Delete Data
    const deleteTask = async () => {
        if (taskToDelete) {
            try {
                const userRef = doc(db, "Users", auth.currentUser.uid);
                const taskRef = doc(userRef, "tasks", taskToDelete);
                await deleteDoc(taskRef);
                console.log("Task deleted successfully!");
                setTaskToDelete(null);
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    // useEffect Hook
    useEffect(() => {
        const unsubscribe = fetchTasks();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);


    return (
        <div>
            <div className="container mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : tasks.length > 0 ? (
                    <ul className="list-group">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="list-group-item d-flex justify-content-between align-items-center task-list"
                            >
                                <div>
                                    <input type="checkbox" className="me-2" />
                                    <span className="fw-bold">{task.title}</span>
                                    <p className="mb-0 text-muted">{task.description}</p>
                                    <small className="text-muted">
                                        {new Date(task.createdAt?.toDate()).toLocaleString()}
                                    </small>
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className="editIcon"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="deleteIcon"
                                        data-bs-toggle="modal"
                                        data-bs-target="#taskDelModal"
                                        onClick={() => setTaskToDelete(task.id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks available!</p>
                )}
            </div>
            <TaskDeleteModal deleteTask={deleteTask} />
        </div>
    );
}
