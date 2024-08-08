import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const CameraRecordingDaysList = lazy(() => import('./CameraRecordingDaysList'));


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/"  element={<Home />} />
            <Route path="/camera-recordings-list/:id" element={<CameraRecordingDaysList />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
