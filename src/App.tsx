import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import RegisterAdmin from "./pages/RegisterAdmin";
import RegisterVendor from "./pages/RegisterVendor";
import ForgetPassword from "./pages/ForgetPassword";
import OtpConfiramtionPage from "./pages/OtpConfirmationPage";
import Layout from "./components/Layout";
import AdminPanel from "./pages/AdminPanel";
import VendorsList from "./pages/VendorsList";
import Categories from "./pages/Categories";
import RfpList from "./pages/RfpList";
import RfpQuotes from "./pages/RfpQuotes";
import RfpSelectCategory from "./pages/RfpSelectCategory";
import CreateRfp from "./pages/CreateRfp";
import RfpForQuotes from "./pages/RfpForQuotes";
import ApplyRfp from "./pages/ApplyRfp";
import RfpVendorQuotes from "./pages/RfpVendorQuotes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register-admin",
      element: <RegisterAdmin />,
    },
    {
      path: "/register-vendor",
      element: <RegisterVendor />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },
    {
      path: "/otp-confirmation",
      element: <OtpConfiramtionPage />,
    },
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { path: "/", element: <AdminPanel /> },
            { path: "/vendors-list", element: <VendorsList /> },
            { path: "/categories", element: <Categories /> },
            { path: "/rfp-list", element: <RfpList />},
            {
              path: "/rfp-list/rfp-Quotes/:rfp_id",
              element: <RfpQuotes />,
            },
            {path:"/rfpselectcategory" , element:<RfpSelectCategory/>},
            {path:"/rfpcreate/:category_id",element:<CreateRfp/>},
            {path:"/rfp-for-quotes",element:<RfpForQuotes/>},
            {path:"/rfp-for-quotes/applyquotes/:rfp_id",element:<ApplyRfp/>},
            {
              path: "/rfp-for-quotes/rfp-quotes/:rfp_id",
              element: <RfpVendorQuotes />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
