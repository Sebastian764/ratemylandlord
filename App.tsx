import React, { useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import LandlordPage from "./pages/LandlordPage";
import AddLandlordPage from "./pages/AddLandlordPage";
import AddReviewPage from "./pages/AddReviewPage";
import EditReviewPage from "./pages/EditReviewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { MockAuthService } from "./services/MockAuthService";
import { CityDemoApiService } from "./services/CityDemoApiService";
import { cities, findCity } from "./cities/registry";
import { CityContext, useCity } from "./cities/context";
import { cityStyle, type CityPage } from "./cities/types";
import CitySelectionPage from "./pages/CitySelectionPage";
import CityNavigation from "./cities/CityNavigation";
import LocalInfo from "./cities/LocalInfo";
import "./cities/styles.css";

const authService = new MockAuthService();
const allReviews = cities.flatMap((city) => city.reviews);

function AppContent() {
  const city = useCity()!;
  const Home = city.Home;
  const page = (name: CityPage, fallback: React.ReactNode) => {
    const Override = city.pages?.[name];
    return Override ? <Override /> : fallback;
  };
  const Layout = city.Layout ?? DefaultCityLayout;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/landlord/:id"
          element={page("landlord", <LandlordPage />)}
        />
        <Route
          path="/landlord/:id/add-review"
          element={page("addReview", <AddReviewPage />)}
        />
        <Route
          path="/landlord/:id/review/:reviewId/edit"
          element={page("editReview", <EditReviewPage />)}
        />
        <Route
          path="/add-landlord"
          element={page("addLandlord", <AddLandlordPage />)}
        />
        <Route path="/login" element={page("login", <LoginPage />)} />
        <Route path="/register" element={page("register", <RegisterPage />)} />
        <Route
          path="/contact"
          element={page(
            "contact",
            city.slug === "pittsburgh" ? (
              <ContactPage />
            ) : (
              <LocalInfo kind="contact" />
            ),
          )}
        />
        <Route
          path="/terms-and-conditions"
          element={page(
            "terms",
            city.slug === "pittsburgh" ? (
              <TermsAndConditionsPage />
            ) : (
              <LocalInfo kind="terms" />
            ),
          )}
        />
        <Route path="/admin" element={page("admin", <AdminPage />)} />
        <Route
          path="/resources"
          element={page(
            "resources",
            city.slug === "pittsburgh" ? (
              <ResourcesPage />
            ) : (
              <LocalInfo kind="resources" />
            ),
          )}
        />
        <Route
          path="/reset-password"
          element={page("resetPassword", <ResetPasswordPage />)}
        />
        <Route
          path="/verify-email"
          element={page("verifyEmail", <VerifyEmailPage />)}
        />
        <Route path="*" element={page("notFound", <NotFoundPage />)} />
      </Routes>
    </Layout>
  );
}

function DefaultCityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <CityNavigation />
      <Header />
      <div className="demo-notice" role="note">
        Concept preview · All landlords and reviews are fictional. Guest reviews
        reset when you leave this city or refresh. Accounts and verification are
        unavailable.
      </div>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

function CitySite({ slug }: { slug: string }) {
  const city = findCity(slug);
  const api = useMemo(
    () => (city ? new CityDemoApiService(city, allReviews) : undefined),
    [city],
  );
  useEffect(() => {
    document.title = city ? `${city.brand} — ${city.name}` : "City not found";
  }, [city]);
  if (!city || !api)
    return (
      <div className="network-main">
        <h1 className="text-3xl font-bold">City not found</h1>
        <p>This community is not available yet.</p>
        <Link to="/">Choose a supported city →</Link>
      </div>
    );
  return (
    <CityContext.Provider value={city}>
      <ServicesProvider api={api} auth={authService}>
        <AuthProvider>
          <DataProvider>
            <div
              className="city-site"
              data-city={city.slug}
              style={cityStyle(city)}
            >
              <AppContent />
            </div>
          </DataProvider>
        </AuthProvider>
      </ServicesProvider>
    </CityContext.Provider>
  );
}

function CityRoute() {
  const { citySlug } = useParams();
  // Remount every context and cache when changing cities, including browser Back.
  return <CitySite key={citySlug} slug={citySlug!} />;
}

function Landing() {
  useEffect(() => {
    document.title = "RateYinzLandlord — Landlord reviews";
  }, []);
  return <CitySelectionPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:citySlug/*" element={<CityRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
