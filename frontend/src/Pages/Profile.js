import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../Components/Navbar";

export default function Profile() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "Users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserDetails(docSnap.data());
                        console.log(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error.message);
                }
            } else {
                console.log("User is not logged in");
                navigate("/");
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <div>
            <div><Navbar /></div>
            {loading ? (
                <p>Loading...</p>
            ) : userDetails ? (
                <div>
                    <h3>Welcome, {userDetails.fullName}!</h3>
                    <div>
                        <p><strong>Full Name:</strong> {userDetails.fullName}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <p>User details could not be loaded. Please log in.</p>
            )}
        </div>
    );
}
