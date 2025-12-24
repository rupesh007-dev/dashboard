import ProgramTabs from './ProgramTabs/ProgramTabs';

export default function ProgramLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProgramTabs />
      </div>
    </div>
  );
}
