import { useParams } from 'react-router-dom';
import ProgramDetailPage from './ProgramDetailPage';

export default function ProgramDetail() {
  const { programId } = useParams();
  return <ProgramDetailPage programId={programId} PageBreadcrumb={true} />;
}
