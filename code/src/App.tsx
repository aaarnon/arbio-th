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
import { Login } from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Public route - login page WITHOUT sidebar - MUST BE FIRST */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes WITH sidebar/layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<CaseList />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="teams" element={<Teams />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai-agents" element={<AIAgents />} />
        <Route path="settings" element={<Settings />} />
        <Route path="status-comparison" element={<StatusComparison />} />
        <Route path="cases/:caseId" element={<CaseDetail />} />
        <Route path="cases/:caseId/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
