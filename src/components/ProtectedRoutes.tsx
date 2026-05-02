import { useAuthStore } from '@/store/authStore';
import  { type JSX } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ():JSX.Element => {
  const {isAuthenticated} = useAuthStore();
  if(!isAuthenticated){
        return<Navigate to="/login" replace />;
  }
  return (
    <div>
      {/* {type==='admin'?<Outlet/>:<VendorPanel/>} */}
      <Outlet/>
    </div>
  )
}

export default ProtectedRoutes
