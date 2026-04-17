import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <div className="px-4 py-6">{children}</div>
    </div>
  );
}

export default Layout;
