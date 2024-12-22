import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { doc, collection, onSnapshot, query, orderBy, where, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Task.css';
import TaskDeleteModal from "../TaskDeleteModal";
import Modal from "../Modal";

export default function TaskPage() {
    const [activeTasks, setActiveTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState(null); // delete task
    const [taskToEdit, setTaskToEdit] = useState(null); // Edit task
    const navigate = useNavigate();

    // Fetch tasks from Firestore
    useEffect(() => {
        const fetchTasks = () => {
            auth.onAuthStateChanged((user) => {
                if (!user) {
                    console.log("User is not logged in");
                    setActiveTasks([]);
                    setCompletedTasks([]);
                    setLoading(false);
                    navigate("/", { replace: true });
                    return;
                }

                const userRef = doc(db, "Users", user.uid);
                const tasksCollectionRef = collection(userRef, "tasks");

                const activeTasksQuery = query(
                    tasksCollectionRef,
                    where("completed", "==", false),
                    orderBy("createdAt", "desc")
                );

                const completedTasksQuery = query(
                    tasksCollectionRef,
                    where("completed", "==", true),
                    orderBy("completedAt", "desc")
                );

                const fetchActiveQuery = onSnapshot(activeTasksQuery, (snapshot) => {
                    const fetchedActiveTasks = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("Fetched Active Tasks:", fetchedActiveTasks);
                    setActiveTasks(fetchedActiveTasks);
                });

                const fetchCompletedQuery = onSnapshot(completedTasksQuery, (snapshot) => {
                    const fetchedCompletedTasks = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("Fetched Completed Tasks:", fetchedCompletedTasks);
                    setCompletedTasks(fetchedCompletedTasks);
                });

                setLoading(false);

                return () => {
                    fetchActiveQuery();
                    fetchCompletedQuery();
                };
            });
        };

        const unsubscribe = fetchTasks();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [navigate]);

    // Is the task completed?
    const isTaskCompleted = async (taskId, isCompleted) => {
        try {
            console.log("Task ID:", taskId);
            console.log("Is Completed:", isCompleted);
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const taskRef = doc(userRef, "tasks", taskId);

            await updateDoc(taskRef, {
                completed: isCompleted,
                completedAt: isCompleted ? serverTimestamp() : null,
                updatedAt: serverTimestamp(),
            });
            console.log("Task completion status updated!");
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    // Edit task
    const editTask = async (taskId, updatedData) => {
        try {
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const taskRef = doc(userRef, "tasks", taskId);
            await updateDoc(taskRef, {
                ...updatedData,
                updatedAt: serverTimestamp(),
            });
            console.log("Task updated successfully!");
            setTaskToEdit(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Delete task
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

    return (
        <div>
            <div className="container mt-4">
                {loading ? (<p>Loading...</p>) : (
                    <>
                        <h3>Active Tasks</h3>
                        {activeTasks.length > 0 ? (
                            <ul className="list-group">
                                {activeTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="list-group-item d-flex justify-content-between align-items-center task-list"
                                    >
                                        <div>
                                            <input
                                                type="checkbox"
                                                className="me-2"
                                                checked={task.completed}
                                                onChange={(e) =>
                                                    isTaskCompleted(task.id, e.target.checked)
                                                }
                                            />
                                            <span className="fw-bold">{task.title}</span>
                                            <p className="mb-0 text-muted">{task.description}</p>
                                            <small className="text-muted">
                                                {/* Created At:{new Date(task.createdAt?.toDate()).toLocaleString()} */}
                                            </small>
                                            {task.updatedAt && (
                                                <small className="text-muted d-block">
                                                    {/* Updated At: {new Date(task.updatedAt?.toDate()).toLocaleString()} */}
                                                </small>
                                            )}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className="editIcon"
                                                data-bs-toggle="modal"
                                                data-bs-target="#taskEditModal"
                                                onClick={() => setTaskToEdit(task)}
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
                            <p>No active tasks</p>
                        )}

                        <h3 className="mt-4">Completed Tasks</h3>
                        {completedTasks.length > 0 ? (
                            <ul className="list-group">
                                {completedTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className="list-group-item d-flex justify-content-between align-items-center task-list"
                                    >
                                        <div>
                                            <input
                                                type="checkbox"
                                                className="me-2"
                                                checked={task.completed}
                                                onChange={(e) =>
                                                    isTaskCompleted(task.id, e.target.checked)
                                                }
                                            />
                                            <span className="fw-bold text-decoration-line-through">{task.title}</span>
                                            <p className="mb-0 text-muted">{task.description}</p>
                                            <small className="text-muted">
                                                {/* Created At:{new Date(task.createdAt?.toDate()).toLocaleString()} */}
                                            </small>
                                            {task.updatedAt && (
                                                <small className="text-muted d-block">
                                                    {/* Updated At: {new Date(task.updatedAt?.toDate()).toLocaleString()} */}
                                                </small>
                                            )}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className="editIcon"
                                                data-bs-toggle="modal"
                                                data-bs-target="#taskEditModal"
                                                onClick={() => setTaskToEdit(task)}
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
                            <p>No completed tasks</p>
                        )}
                    </>
                )}

                {/* Modals */}
                <TaskDeleteModal deleteTask={deleteTask} />
                <Modal
                    id="taskAddModal"
                    task={null}
                    // onSave={(newTaskData) => addTask(newTaskData)}
                    onClose={() => setTaskToEdit(null)}
                />
                <Modal
                    id="taskEditModal"
                    task={taskToEdit}
                    onSave={(updatedData) => editTask(taskToEdit.id, updatedData)}
                    onClose={() => setTaskToEdit(null)}
                />
            </div>
        </div>
    );
}
