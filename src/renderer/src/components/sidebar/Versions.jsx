export default function Versions() {
  const sys = [
    { name: 'Electron', ver: '45.35.34', dot: 'bg-blue-400' },
    { name: 'Chrome', ver: '120.0.1', dot: 'bg-green-400' },
    { name: 'Node', ver: '20.10.0', dot: 'bg-emerald-400' },
  ];

  return (
    <div className="w-full mt-10 mb-4">
      <ul className="space-y-2">
        {sys.map((item) => (
          <li key={item.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <span className={`h-1 w-1 rounded-full ${item.dot} opacity-70`} />
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {item.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              v{item.ver}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/5 flex justify-between items-center">
        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">System Status</span>
        <span className="text-[9px] text-emerald-500 font-bold uppercase">Stable</span>
      </div>
    </div>
  );
}
