import { Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from './Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddInsurancePage from "./pages/AddInsurancePage";
import MyPoliciesPage from "./pages/MyPoliciesPage";
import AgentDashboard from "./agents/Dashboard";
import CompanySelection from "./agents/Company-Selection";
import { AuthProvider, useAuth } from "./context/AuthContext";
import './assets/css/style.css';

import CompanyPage from "./agents/CompanyPage";
import CompanyCustomersPage from "./agents/CompanyCustomersPage";
import CustomerProfilePage from "./agents/CustomerProfilePage";
import CustomerList from "./agents/CustomerList";
import ImportExcelPage from "./agents/ImportExcelPage";
import AddManualCustomer from "./agents/AddManualCustomer";
import DuePaymentsPage from "./agents/DuePaymentsPage";
import ImportReportPage from "./agents/ImportReportPage";
import AddFamilyMember from "./agents/AddFamilyMember";
import FamilyHistory from "./agents/FamilyHistory";
import PolicyAlterations from "./agents/PolicyAlterations";
import PremiumDeposit from "./agents/PremiumDeposit";
import MedicalHistoryPage from "./agents/MedicalHistoryPage";
import NotificationPage from "./agents/NotificationPage";
import InsuranceCategoryPage from "./agents/InsuranceCategoryPage";
import PolicyDuePage from "./pages/PolicyDuePage";
import PolicyViewPage from "./pages/PolicyViewPage";

// ✅ Import Agent Layout (Sidebar + NotificationProvider)
import AgentLayout from "./agents/Agentlaout";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/customer/mypolicies" element={<MyPoliciesPage />} />
        <Route path="/customer/addinsurance" element={<AddInsurancePage />} />
        <Route path="/customer/due-payments" element={<PolicyDuePage />} />
        <Route path="/customer/policy-view" element={<PolicyViewPage />} />

        {/* Agent Routes */}
        <Route path="/agent/company-selection" element={<CompanySelection />} />

        {/* ✅ All agent routes wrapped inside AgentLayout */}
  <Route 
  path="/agent/dashboard" 
  element={
    <ProtectedRoute>
      <AgentLayout>
        <AgentDashboard />
      </AgentLayout>
    </ProtectedRoute>
  }
/>
        <Route
          path="/agent/companies"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <CompanyPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/company/:companyName"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <CompanyCustomersPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/company/:id"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <CompanyCustomersPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/customer/:id"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <CustomerProfilePage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/customers"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <CustomerList />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/import-excel"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <ImportExcelPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/add-manual"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <AddManualCustomer />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/due-payments"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <DuePaymentsPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/report"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <ImportReportPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/add-family"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <AddFamilyMember />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/family-history"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <FamilyHistory />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/policy-alterations"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <PolicyAlterations />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/premium-deposit"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <PremiumDeposit />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/medical-history"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <MedicalHistoryPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/notification"
          element={
            <ProtectedRoute>
              <AgentLayout>
                <NotificationPage />
              </AgentLayout>
            </ProtectedRoute>
          }
        />

        {/* Other Routes */}
        <Route path="/select-insurance" element={<InsuranceCategoryPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
