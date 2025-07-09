import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';

import LandingScreen from './pages/LandingScreen';
import RegisterStudent from './pages/RegisterStudent';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';

import Login from './pages/Login';
import SessionManager from './pages/SessionManager';
import StudentList from './pages/StudentList';
import GenerateSessions from './pages/GenerateSessions';
import TeacherDashboard from './pages/teacherdashboard';

import './App.css';

function App() {
  return (
    <div className="app-background">
      <Navbar />
      <main className="app-content">
        <Routes>
          {/* 👨‍🎓 صفحات التلميذ */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/student-register" element={<RegisterStudent />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          {/* 👨‍🏫 صفحات الأستاذ (بحماية) */}
          <Route
            path="/login"
            element={
              <RequireAuth>
                <Login />
              </RequireAuth>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <RequireAuth>
                <TeacherDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/session-manager"
            element={
              <RequireAuth>
                <SessionManager />
              </RequireAuth>
            }
          />
          <Route
            path="/student-list"
            element={
              <RequireAuth>
                <StudentList />
              </RequireAuth>
            }
          />
          <Route
            path="/generate-sessions"
            element={
              <RequireAuth>
                <GenerateSessions />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
