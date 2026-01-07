import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dummyy from "./dummyy/dummyy";
import Navigation from "./pages/Navigation";
import HomePage from "./pages/MainHomepage";
import ArtworkListingPage from "./pages/ArtworkListingPage";
import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import ArtistDashboard from "./pages/artistPages/ArtistDashboard";
import BuyerDashboard from "./pages/buyerPages/BuyerDashboard";
import AdminPanel from "./pages/adminPages/AdminPanel";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { LoginPage } from "./pages/loginPage/LoginPage";
import AdminLoginPage from "./pages/loginPage/AdminLoginPage";
import BuyerLoginPage from "./pages/loginPage/BuyerLoginPage";
import ArtistLoginPage from "./pages/loginPage/ArtistLoginPage";
import BidPage from "./pages/buyerPages/BidPage";
import useAppState from "./useAppState";

function App() {
  const app = useAppState();

  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        {/* Always show navigation */}
        <Navigation
          isLoggedIn={app.isLoggedIn}
          userRole={app.userRole}
          handleLogout={app.handleLogout}
          mobileMenuOpen={app.mobileMenuOpen}
          setMobileMenuOpen={app.setMobileMenuOpen}
        />

        {/* Define routes */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                artworks={app.artworks}
                setSelectedArtwork={app.setSelectedArtwork}
              />
            }
          />
          <Route
            path="/artworks"
            element={
              <ArtworkListingPage
                filteredArtworks={app.filteredArtworks}
                searchTerm={app.searchTerm}
                filterCategory={app.filterCategory}
                filterPrice={app.filterPrice}
                handleSearch={app.setSearchTerm}
                handleCategoryFilter={app.setFilterCategory}
                handlePriceFilter={app.setFilterPrice}
                setSelectedArtwork={app.setSelectedArtwork}
              />
            }
          />
          <Route
            path="/artwork/:id"
            element={
              <ArtworkDetailPage
                selectedArtwork={app.selectedArtwork}
                isLoggedIn={app.isLoggedIn}
                userRole={app.userRole}
                bidAmount={app.bidAmount}
                setBidAmount={app.setBidAmount}
                handlePlaceBid={app.handlePlaceBid}
                bidHistory={app.bidHistory}
              />
            }
          />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bid/:id" element={<BidPage />} />
          {/* <Route path="/artwork/:id" element={<ArtworkDetailPage />} /> */}


          <Route
            path="/buyer-login"
            element={<BuyerLoginPage handleLogin={app.handleLogin} />}
          />
          <Route
            path="/artist-login"
            element={<ArtistLoginPage handleLogin={app.handleLogin} />}
          />
          <Route
            path="/admin-login"
            element={<AdminLoginPage handleLogin={app.handleLogin} />}
          />
          <Route path="/aa" element={<Dummyy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
