import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const CameraRecordingDaysList = lazy(() => import('./CameraRecordingDaysList'));
const ClipDisplay = lazy(() => import('./ClipDisplay'));
const CameraLiveDisplay = lazy(() => import('./CameraLiveDisplay'));


function App() {
  return (
    <Router>
      <Suspense fallback={<div className='d-flex justify-content-center mt-5'><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></div>}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/"  element={<Home />} />
            <Route path="/camera-live-display/:url"  element={<CameraLiveDisplay />} />
            <Route path="/camera-recordings-list/:id" element={<CameraRecordingDaysList />} />
            <Route path="/clip-display/:url/"  element={<ClipDisplay />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
