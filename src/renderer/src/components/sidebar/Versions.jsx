// export default function Versions() {
//   const sys = [
//     { name: 'Electron', ver: '45.35.34', dot: 'bg-blue-400' },
//     { name: 'Chrome', ver: '120.0.1', dot: 'bg-green-400' },
//     { name: 'Node', ver: '20.10.0', dot: 'bg-emerald-400' },
//   ];
//   // Safe access with optional chaining
//   // const [versions] = useState(window.electron?.process?.versions)

//   // useEffect(() => {
//   //   if (window.electron) {
//   //     console.log("--- Debugging Electron Context ---")
//   //     console.log("Full Window Object:", window)
//   //     console.log("Electron Toolkit API:", window.electron)
//   //     console.log("Process Versions:", window.electron.process.versions)
//   //   } else {
//   //     console.warn("Electron API not found. Are you running in a web browser?")
//   //   }
//   // }, [])

//   // if (!versions) {
//   //   return <div>Loading versions...</div>
//   // }

//   return (
//     <div className="w-full mt-10 mb-4">
//       <ul className="space-y-2">
//         {sys.map((item) => (
//           <li key={item.name} className="flex items-center justify-between group">
//             <div className="flex items-center gap-2">
//               <span className={`h-1 w-1 rounded-full ${item.dot} opacity-70`} />
//               <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                 {item.name}
//               </span>
//             </div>
//             <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
//               v{item.ver}
//             </span>
//           </li>
//         ))}
//       </ul>
//       <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/5 flex justify-between items-center">
//         <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">System Status</span>
//         <span className="text-[9px] text-emerald-500 font-bold uppercase">Stable</span>
//       </div>
//     </div>
//     //     <ul className="versions">
//     //   <li className="electron-version">Electron v{versions.electron}</li>
//     //   <li className="chrome-version">Chromium v{versions.chrome}</li>
//     //   <li className="node-version">Node v{versions.node}</li>
//     // </ul>
//   );
// }

import { useState, useEffect } from 'react';

export default function Versions() {
  // Initialize with your static defaults (fallback)
  const [versions, setVersions] = useState({
    electron: '-',
    chrome: '-',
    node: '-',
  });

  useEffect(() => {
    // Check if running inside Electron and the API is exposed
    if (window.electron?.process?.versions) {
      const v = window.electron.process.versions;
      setVersions({
        electron: v.electron,
        chrome: v.chrome,
        node: v.node,
      });
    }
  }, []);

  const sys = [
    { name: 'Electron', ver: versions.electron, dot: 'bg-blue-400' },
    { name: 'Chrome', ver: versions.chrome, dot: 'bg-green-400' },
    { name: 'Node', ver: versions.node, dot: 'bg-emerald-400' },
  ];

  return (
    <div className="w-full mt-10 mb-4 px-2">
      <ul className="space-y-2">
        {sys.map((item) => (
          <li key={item.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${item.dot} shadow-[0_0_5px_rgba(0,0,0,0.1)]`} />
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {item.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              v{item.ver}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">System Status</span>
        <div className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-500 font-bold uppercase">Stable</span>
        </div>
      </div>
    </div>
  );
}
