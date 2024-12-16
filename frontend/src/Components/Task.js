import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { doc, collection, onSnapshot, query, orderBy, where, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Task.css';
import TaskDeleteModal from "../TaskDeleteModal";
import Modal from "../Modal";

export default function Task() {
    const [tasks, setTasks] = useState([]); // add task
    const [loading, setLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState(null); // delete task
    const [taskToEdit, setTaskToEdit] = useState(null); // Edit task
    const navigate = useNavigate();

    // Fetch tasks from Firestore
    const fetchTasks = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userRef = doc(db, "Users", user.uid);
                const tasksCollectionRef = collection(userRef, "tasks");
                // order by createdAt
                const tasksQuery = query(tasksCollectionRef, orderBy("createdAt", "desc"));

                // Real-time updates
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

    //Is the task completed?
    const isTaskCompleted = async (taskId, isCompleted) => {
        try {
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const taskRef = doc(userRef, "tasks", taskId);

            await updateDoc(taskRef, {
                completed: isCompleted,
                updatedAt: serverTimestamp(),
            });
            console.log("Task completion status updated!");
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    //Add task
    const addTask = async (newTaskData) => {
        try {
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const tasksCollectionRef = collection(userRef, "tasks");
            await addDoc(tasksCollectionRef, {
                ...newTaskData,
                createdAt: serverTimestamp(),
                completed: false, // Default to incomplete
            });
            console.log("Task added successfully!");
        } catch (error) {
            console.error("Error adding task:", error);
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



    // useEffect Hook
    useEffect(() => {
        const unsubscribe = fetchTasks();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // active and completed tasks filtering
    const activeTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    return (
        <div>
            <div className="container mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : tasks.length > 0 ? (
                    <>
                        <h3>Active Tasks</h3>
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
                                            onClick={() => {
                                                setTaskToEdit(task)
                                                // console.log("Editing task:", task);
                                            }}
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

                        <h3 className="mt-4">Completed Tasks</h3>
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
                                            onClick={() => {
                                                setTaskToEdit(task)
                                                // console.log("Editing task:", task);
                                            }}
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
                    </>
                ) : (
                    <p>No tasks available!</p>
                )}
            </div>

            {/* Modals */}
            <TaskDeleteModal deleteTask={deleteTask} />
            <Modal
                id="taskAddModal"
                task={null}
                onSave={(newTaskData) => addTask(newTaskData)}
                onClose={() => setTaskToEdit(null)}
            />
            <Modal
                id="taskEditModal"
                task={taskToEdit}
                onSave={(updatedData) => editTask(taskToEdit.id, updatedData)}
                onClose={() => setTaskToEdit(null)}
            />
        </div>
    );
}
