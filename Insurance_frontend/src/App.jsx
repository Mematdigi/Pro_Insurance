import { Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
;
import Home from './Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Customer dashboard
import AddInsurancePage from "./pages/AddInsurancePage";
import MyPoliciesPage from "./pages/MyPoliciesPage";
import AgentDashboard from "./agents/Dashboard"; // Dummy Agent dashboard
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

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/customer/mypolicies" element={<MyPoliciesPage />} />
        <Route path="customer/addinsurance" element={<AddInsurancePage />} />
        <Route path="customer/due-payments" element={<PolicyDuePage />} />
        <Route path="customer/policy-view" element={<PolicyViewPage />} />

        {/* Agent Routes */}
        <Route path="/agent/company-selection" element={<CompanySelection />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/companies" element={<CompanyPage />} />
        <Route path="/agent/company/:companyName" element={<CompanyCustomersPage />} />
        <Route path="/agent/company/:id" element={<CompanyCustomersPage />} /> 
        
        <Route path="/agent/customer/:id" element={<CustomerProfilePage />} />

        <Route path="/agent/customers" element={<CustomerList />} />
        <Route path="/agent/import-excel" element={<ImportExcelPage />} />
        <Route path="/agent/add-manual" element={<AddManualCustomer />} />
        <Route path="/agent/due-payments" element={<DuePaymentsPage />} />
        <Route path="/agent/report" element={<ImportReportPage />} />
        <Route path="/agent/add-family" element={<AddFamilyMember />} />
        <Route path="/agent/family-history" element={<FamilyHistory />} />
        <Route path="/agent/policy-alterations" element={<PolicyAlterations />} />
        <Route path="/agent/premium-deposit" element={<PremiumDeposit/>}></Route>
        <Route path="/agent/medical-history" element={<MedicalHistoryPage/>}></Route>
        <Route path="/agent/notification" element={<NotificationPage/>}></Route>
        <Route path="/select-insurance" element={<InsuranceCategoryPage />} />
         





      </Routes>
    </AuthProvider>
  );
}

export default App;
