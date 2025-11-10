import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { CreateCase } from '@/pages/CreateCase';
import { TaskDetail } from '@/pages/TaskDetail';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CaseList />} />
        {/* Create new case page - must be before :caseId route */}
        <Route path="/cases/new" element={<CreateCase />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
