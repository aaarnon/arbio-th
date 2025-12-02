import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { CaseList } from '@/features/cases/components/CaseList';
import { CaseDetail } from '@/features/case-detail/components/CaseDetail';
import { TaskDetail } from '@/pages/TaskDetail';
import { Notifications } from '@/pages/Notifications';
import { Tasks } from '@/pages/Tasks';
import { Teams } from '@/pages/Teams';
import { Reservations } from '@/pages/Reservations';
import { Listings } from '@/pages/Listings';
import { ListingDetail } from '@/pages/ListingDetail';
import { Deals } from '@/pages/Deals';
import { DealDetail } from '@/pages/DealDetail';
import { Reservations2 } from '@/pages/Reservations2';
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
        <Route index element={<Home />} />
        <Route path="cases" element={<CaseList />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="teams" element={<Teams />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:listingId" element={<ListingDetail />} />
        <Route path="deals" element={<Deals />} />
        <Route path="deals/:dealId" element={<DealDetail />} />
        <Route path="reservations2" element={<Reservations2 />} />
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
