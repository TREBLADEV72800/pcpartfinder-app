import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Lazy load routes
const HomePage = lazy(() => import("@routes/HomePage"));
const BuilderPage = lazy(() => import("@routes/BuilderPage"));
const ProductListPage = lazy(() => import("@routes/ProductListPage"));
const ProductDetailPage = lazy(() => import("@routes/ProductDetailPage"));
const ComparePage = lazy(() => import("@routes/ComparePage"));
const BuildsGalleryPage = lazy(() => import("@routes/BuildsGalleryPage"));
const BuildDetailPage = lazy(() => import("@routes/BuildDetailPage"));
const LoginPage = lazy(() => import("@routes/LoginPage"));
const RegisterPage = lazy(() => import("@routes/RegisterPage"));
const ProfilePage = lazy(() => import("@routes/ProfilePage"));

import { lazy } from "react";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:shareId" element={<BuilderPage />} />
        <Route path="/products/:category" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/builds" element={<BuildsGalleryPage />} />
        <Route path="/build/:shareId" element={<BuildDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
