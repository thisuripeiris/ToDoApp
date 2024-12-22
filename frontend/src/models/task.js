import { serverTimestamp } from "firebase/firestore";


class Task {
    constructor({ title, description, completed = false, createdAt = "", updatedAt = "", completedAt = "" }) {

        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completed = completed;
        this.completedAt = completedAt;
    }

    markAsCompleted() {
        this.completed = true;
        this.completedAt = serverTimestamp();
        this.updatedAt = this.completedAt;
    }

    markAsIncomplete() {
        this.completed = false;
        this.completedAt = "";

        this.updatedAt = serverTimestamp();
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            createdAt: this.createdAt,
            completed: this.completed,
            completedAt: this.completedAt,
            updatedAt: this.updatedAt,

        };
    }

    static fromJSON(data) {
        return new Task({
            title: data.title,
            description: data.description,
            createdAt: data.createdAt,
            completed: data.completed,
            completedAt: data.completedAt,
            updatedAt: data.updatedAt,
        }
        );
    }

}

export default Task;