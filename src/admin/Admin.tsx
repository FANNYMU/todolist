import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

export default function Admin() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token"); // Pastikan token disimpan di localStorage atau tempat lain setelah login
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch("http://localhost:5000/admin/checkAuth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to authenticate");
        }

        const data = await response.json();
        setIsAuthenticated(true);
        console.log(data);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch tasks from the API only if authenticated
      const fetchTasks = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/tasks");
          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          } else {
            console.error("Failed to fetch tasks");
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchTasks();
    }
  }, [isAuthenticated]);

  const toggleCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };

      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: updatedTask.completed }),
        });

        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? updatedTask : t))
          );
        } else {
          console.error("Error updating task");
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const removeTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      } else {
        console.error("Error removing task");
      }
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64`}
      >
        <div className="p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <ul>
            <li>
              <Link
                to="/"
                className="text-blue-600 hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="mt-2">
              <Link
                to="/admin"
                className="text-blue-600 hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Admin Dashboard
              </Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Open Sidebar Button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Task Management</h2>
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Task
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-200">
                    <td className="p-3 text-sm text-gray-700">{task.task}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          task.completed
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {task.completed ? "Completed" : "Incomplete"}
                      </span>
                    </td>
                    <td className="p-3 text-sm flex space-x-2">
                      <button
                        onClick={() => toggleCompletion(task.id)}
                        className="p-2 text-blue-500 hover:text-blue-700"
                      >
                        {task.completed ? (
                          <svg
                            className="w-5 h-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
