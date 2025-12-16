import { useState, useEffect } from "react";

const UpdateNotification = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | downloading | ready
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Listen for update available
    window.electronAPI.onUpdateAvailable(() => {
      setShow(true);
    });

    // Listen for progress
    window.electronAPI.onDownloadProgress((progressObj) => {
      setStatus("downloading");
      setProgress(Math.round(progressObj.percent));
    });

    // Listen for completion
    window.electronAPI.onUpdateDownloaded(() => {
      setStatus("ready");
    });

    // Clean up listeners on unmount
    return () => {
      window.electronAPI.removeAllListeners("update-available");
      window.electronAPI.removeAllListeners("download-progress");
      window.electronAPI.removeAllListeners("update-downloaded");
    };
  }, []);

  const handleUpdate = () => {
    setStatus("downloading");
    window.electronAPI.downloadUpdate();
  };

  const handleRestart = () => {
    window.electronAPI.quitAndInstall();
  };

  const handleClose = () => {
    setShow(false);
    // If they cancel during download, we just hide the UI.
    // The download might continue in background or fail,
    // but the user requirement is "show next time when user open".
    // Since we check on startup, closing this satisfies that.
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-end p-6 z-50 pointer-events-none">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80 pointer-events-auto animate-fade-in-up">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {status === "ready" ? "Update Ready" : "Update Available"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {status === "idle" &&
            "A new version of the app is available. Would you like to update now?"}
          {status === "downloading" && `Downloading update... ${progress}%`}
          {status === "ready" &&
            "Update downloaded. Restart now to apply changes?"}
        </p>

        {status === "downloading" && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          {status !== "downloading" && (
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
            >
              {status === "ready" ? "Later" : "Cancel"}
            </button>
          )}

          {status === "idle" && (
            <button
              onClick={handleUpdate}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
            >
              Update
            </button>
          )}

          {status === "ready" && (
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors shadow-sm"
            >
              Restart & Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
