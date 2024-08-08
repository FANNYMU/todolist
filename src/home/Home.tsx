import { useEffect, useRef, useState } from "react";
import "../App.css";
import Form from "../components/Form";

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const newTask = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newTask.current?.value === "") {
      alert("Please add a task");
      return;
    }

    const newTaskData: Omit<Task, "id"> = {
      task: newTask.current!.value,
      completed: false,
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
      });

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);

      if (newTask.current) {
        newTask.current.value = "";
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };

      try {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: updatedTask.completed }),
        });

        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto mt-5 p-4 bg-white shadow-lg rounded-lg">
      <div className="formInput mb-4">
        <Form addTask={addTask} newTask={newTask} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">Task List:</h2>
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${
                task.completed ? "completed" : "incomplete"
              }`}
            >
              <span className="task-text">{task.task}</span>
              <div className="action-buttons">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompletion(task.id);
                  }}
                  className="action-button complete-button"
                >
                  {task.completed ? (
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-counterclockwise"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a7 7 0 0 0-6.28 10.89l-1.73 1.5A1 1 0 0 0 1 14h3a1 1 0 0 0 .68-.26l.58-.58A7 7 0 1 0 8 1z" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-check"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.293 9.293a1 1 0 0 1 1.414 0L12 12.586l.293-.293a1 1 0 0 1 1.414 1.414l-1.5 1.5a1 1 0 0 1-1.414 0L6.293 10.707a1 1 0 0 1 0-1.414z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="action-button delete-button"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 2.5A.5.5 0 0 1 3.5 2h9a.5.5 0 0 1 .5.5V3h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5v9a.5.5 0 0 1-.5.5H1a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5V2.5zM4 5v10h8V5H4zm2.5 0h1v10h-1V5z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
