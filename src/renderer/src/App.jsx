import Versions from "./components/Versions";

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send("ping");

  return (
    <>
      <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
        Send IPC
      </a>
      <h1>hello world</h1>
      <h1>hello rupesh</h1>
      <h1>hello sir</h1>
      <h1>hello ssssssssssssssssssss</h1>


      <Versions />
    </>
  );
}

export default App;
