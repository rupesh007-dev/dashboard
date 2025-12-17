import { useEffect, useState } from 'react'

function Versions() {
  // Safe access with optional chaining
  const [versions] = useState(window.electron?.process?.versions)

  useEffect(() => {
    if (window.electron) {
      console.log("--- Debugging Electron Context ---")
      console.log("Full Window Object:", window)
      console.log("Electron Toolkit API:", window.electron)
      console.log("Process Versions:", window.electron.process.versions)
    } else {
      console.warn("Electron API not found. Are you running in a web browser?")
    }
  }, [])

  if (!versions) {
    return <div>Loading versions...</div>
  }

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  )
}

export default Versions