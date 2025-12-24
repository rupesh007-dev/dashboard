import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';
import Home from './pages/Home';
import NotFound from './components/common/NotFound';
import Attendance from './pages/Attendance';
import Notification from './pages/Notification';
import HomeLayout from './dashboard/home/HomeLayout';
import { AuthRequired } from './lib/AuthRequired';
import Signin from './dashboard/auth/Signin';
import Brief from './pages/Brief';
import BriefLayout from './dashboard/brief/BriefLayout';
import BriefDetail from './dashboard/brief/BriefDetails';
import Program from './pages/Program';
import ProgramLayout from './dashboard/program/ProgramLayout';
import ProgramDetail from './dashboard/program/ProgramDetails';
import Task from './dashboard/home/task/TaskDetails';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<Signin />} />

          <Route element={<AuthRequired />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />}>
                <Route index element={<HomeLayout />} />
                <Route path="/tasks/:taskId" element={<Task />} />
              </Route>

              <Route path="briefs" element={<Brief />}>
                <Route index element={<BriefLayout />} />
                <Route path=":briefId" element={<BriefDetail />} />
              </Route>

              <Route path="programs" element={<Program />}>
                <Route index element={<ProgramLayout />} />
                <Route path=":programId" element={<ProgramDetail />} />
              </Route>

              <Route path="/notification" element={<Notification />} />
              <Route path="/attendance" element={<Attendance />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
