import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingsManage from "./pages/BookingsManage";
import ClientsManage from "./pages/ClientsManage";
import Dashboard from "./pages/Dashboard";
import IncomeReport from "./pages/IncomeReport";
import Login from "./pages/Login";
import NewsBannersManage from "./pages/NewsBannersManage";
import ReviewsManage from "./pages/ReviewsManage";
import TreatmentsManage from "./pages/TreatmentsManage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="treatments" element={<TreatmentsManage />} />
          <Route path="bookings" element={<BookingsManage />} />
          <Route path="clients" element={<ClientsManage />} />
          <Route path="income" element={<IncomeReport />} />
          <Route path="reviews" element={<ReviewsManage />} />
          <Route path="news-banners" element={<NewsBannersManage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
