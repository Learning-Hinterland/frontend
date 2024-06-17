import Navbar from "../components/Navbar";
import PWAOfflineStatus from "../components/PWAOfflineStatus";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <PWAOfflineStatus />
    </>
  );
}

export default Layout;
