import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const TrekManagement = lazy(() => import("./pages/TrekManagement"));
const EnrollmentManagement = lazy(() => import("./pages/EnrollmentManagement"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement"));
const GalleryManagement = lazy(() => import("./pages/GalleryManagement"));
const ReviewManagement = lazy(() => import("./pages/ReviewManagement"));
const Inquiries = lazy(() => import("./pages/Inquiries"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const SiteContent = lazy(() => import("./pages/SiteContent"));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/treks" element={<TrekManagement />} />
              <Route path="/enrollments" element={<EnrollmentManagement />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/gallery" element={<GalleryManagement />} />
              <Route path="/reviews" element={<ReviewManagement />} />
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/site-content" element={<SiteContent />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
