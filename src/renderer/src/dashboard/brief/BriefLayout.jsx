import BriefTabs from './BriefTabs/BriefTabs';

export default function BriefLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <BriefTabs />
      </div>
    </div>
  );
}
