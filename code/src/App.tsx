import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { TaskDetail } from '@/pages/TaskDetail';
import { Notifications } from '@/pages/Notifications';
import { Tasks } from '@/pages/Tasks';
import { Teams } from '@/pages/Teams';
import { Reports } from '@/pages/Reports';
import { AIAgents } from '@/pages/AIAgents';
import { Settings } from '@/pages/Settings';
import { StatusComparison } from '@/pages/StatusComparison';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-agents" element={<AIAgents />} />
        <Route path="/settings" element={<Settings />} />
        {/* Status comparison demo page */}
        <Route path="/status-comparison" element={<StatusComparison />} />
        <Route path="/cases/:caseId" element={<CaseDetail />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
