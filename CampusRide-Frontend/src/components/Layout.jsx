import Navbar from "./Navbar";
import Ryde from "./Ryde";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </main>
      <Ryde />
    </div>
  );
}

export default Layout;
