import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './FrontPage';
import LoginPage from './pages/LoginPage';

import Master from './pages/Master';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/game" element={<Master />} />
    </Routes>
  </Router>
);

export default App;
  