import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
const handleLogin = () => {
         navigate("/login");
    };
  return (
    <div className="font-sans bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-pink-600">SK Cards</h1>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="hidden md:block w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <div>
            <span
  className="text-sm text-gray-500 hidden md:block cursor-pointer"
  onClick={handleLogin}
>
  Login / Signup
</span>
          </div>
        </div>
        <div className="block md:hidden px-4 pb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </header>
    </div>
  );
}
