import React from "react";
import Layout from "./components/layout/Layout";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Why from "./pages/Why";
import EconomicModel from "./pages/EconomicModel";
import Territories from "./pages/Territories";
import Pricing from "./pages/Pricing";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import Application from "./pages/Application";
import ContractModels from "./pages/ContractModels";
import { useEffect } from "react";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pourquoi" element={<Why />} />
          <Route path="/modele-economique" element={<EconomicModel />} />
          <Route path="/territoires" element={<Territories />} />
          <Route path="/prix" element={<Pricing />} />
          <Route path="/processus" element={<Process />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/candidature" element={<Application />} />
          <Route path="/modeles-contrat" element={<ContractModels />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" richColors theme="dark" closeButton />
    </Router>
  );
}

export default App;