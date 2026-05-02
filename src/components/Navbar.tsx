import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logOut } = useAuthStore();
  return (
    <div className="bg-white border-b-2 mb-2">
      <div className="font-semibold flex items-end justify-end mr-4">
        <header>
          {user ? (
            <div className="flex gap-10 my-2 w-full h-10">
              <div>
                <span>Welcome,   <span className="ml-1">{user.name}</span></span>
              </div>
              <div>
                <Link to="/login">
                  <button
                    className=" cursor-pointer text-blue-400 hover:underline"
                    onClick={logOut}
                  >
                    Logout
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </header>
      </div>
    </div>
  );
};

export default Navbar;
