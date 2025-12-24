import RandomQuote from './RandomQuote/RandomQuote';
import TaskTabsSoft from './task/TaskTabs/TaskTabs';

export default function HomeLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <RandomQuote />
      </div>
      <div className="col-span-12">
        <TaskTabsSoft />
      </div>
    </div>
  );
}
