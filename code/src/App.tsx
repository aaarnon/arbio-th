import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { CreateCase } from '@/pages/CreateCase';
import { CreateTask } from '@/pages/CreateTask';
import { TaskDetail } from '@/pages/TaskDetail';
import { StatusComparison } from '@/pages/StatusComparison';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CaseList />} />
        {/* Status comparison demo page */}
        <Route path="/status-comparison" element={<StatusComparison />} />
        {/* Create new case page - must be before :caseId route */}
        <Route path="/cases/new" element={<CreateCase />} />
        {/* Create new task page - must be before :taskId route */}
        <Route path="/cases/:caseId/tasks/new" element={<CreateTask />} />
        {/* Create new subtask page - must be before :taskId route */}
        <Route path="/cases/:caseId/tasks/:taskId/subtasks/new" element={<CreateTask />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
