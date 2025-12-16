import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 underline mb-4">
        Dashboard App
      </h1>
      <p className="text-gray-600">Current Version Check</p>

      {/* Add the notification component here. It will stay hidden until an update is found. */}
      <UpdateNotification />
    </div>
  );
}

export default App;
