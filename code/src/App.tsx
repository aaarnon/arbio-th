import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { TaskDetail } from '@/pages/TaskDetail';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
