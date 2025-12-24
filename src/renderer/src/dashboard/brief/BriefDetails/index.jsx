import { useParams } from 'react-router-dom';
import BriefDetailPage from './BriefDetailPage';

export default function BriefDetail() {
  const { briefId } = useParams();
  return <BriefDetailPage briefId={briefId} PageBreadcrumb={true} />;
}
