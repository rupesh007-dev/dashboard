import { motion as Motion, useAnimate, useDragControls, useMotionValue } from 'framer-motion';
import useMeasure from 'react-use-measure';

export function Drawer({ open, setOpen, children, width = '90%' }) {
  const [scope, animate] = useAnimate();
  const [drawerRef, { width: drawerWidth }] = useMeasure();

  const x = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, { opacity: [1, 0] });
    const xStart = typeof x.get() === 'number' ? x.get() : 0;
    await animate('#drawer', { x: [xStart, drawerWidth] });
    setOpen(false);
  };

  return (
    <>
      {open && (
        <Motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-999999999 bg-black/60"
        >
          <button
            onClick={handleClose}
            aria-label="Close drawer"
            className="absolute right-10 top-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full overflow-hidden bg-white dark:bg-neutral-900"
            style={{
              x,
              width: width,
              maxWidth: width,
            }}
            drag="x"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ left: 0, right: drawerWidth }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={() => {
              if (x.get() >= 100) handleClose();
            }}
          >
            <div className="absolute left-0 top-[50%] z-10 flex justify-center bg-neutral-900/10 p-3">
              <button
                onPointerDown={(e) => controls.start(e)}
                className="h-10 w-2 cursor-grab rounded-full bg-neutral-400 active:cursor-grabbing"
              ></button>
            </div>

            <div className="relative z-0 h-full overflow-y-auto p-6 space-y-6">{children}</div>
          </Motion.div>
        </Motion.div>
      )}
    </>
  );
}
