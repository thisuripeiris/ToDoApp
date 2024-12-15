import React from 'react';
import Navbar from '../Components/Navbar';
import '../CSS/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import Task from '../Components/Task';

export default function Home() {
    return (
        <div>
            <Navbar />

            {/* Plus Icon Link */}
            <div className="plusIcon">
                <FontAwesomeIcon
                    icon={faCalendarPlus}
                    data-bs-toggle="modal"
                    data-bs-target="#taskAddModal"
                    size="3x"
                    style={{ color: '#960db9', cursor: 'pointer' }}
                />
            </div>

            {/* Bootstrap Modal */}
            <Modal />
            <Task />
        </div>
    );
}
