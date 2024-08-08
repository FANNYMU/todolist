export default function Form(props: any) {
  return (
    <div className="relative">
      <form onSubmit={props.addTask} className="flex items-center">
        <input
          type="text"
          id="Search"
          placeholder="Add task..."
          ref={props.newTask}
          className="w-full rounded-md border-gray-300 py-2.5 px-4 shadow-sm sm:text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Add
        </button>
      </form>
    </div>
  );
}
