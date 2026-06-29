import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Globe, Instagram, LogIn, Mail, MapPin, Menu, Phone, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import CustomerLoginModal from "./CustomerLoginModal";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";
import { logoUrl } from "../data/fallbacks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Treatments", to: "/treatments" },
  { label: "Location", to: "/location" }
];

const linkClass = ({ isActive }) =>
  `text-sm font-bold transition hover:text-brand-red ${
    isActive ? "text-brand-red" : "text-brand-charcoal"
  }`;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { customer, openLogin, logout } = useCustomerAuth();

  const handleLoginClick = () => {
    setOpen(false);
    openLogin();
  };

  return (
    <div className="min-h-screen bg-brand-sage/45 text-brand-charcoal">
      <header className="sticky top-0 z-50 border-b border-brand-gold/25 bg-white/92 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <motion.img
              src={logoUrl}
              alt="Sethsuwa logo"
              className="h-14 w-14 shrink-0 object-contain drop-shadow-md"
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: -3, scale: 1.06 }}
              transition={{ duration: 0.7 }}
            />
            <motion.span
              className="brand-title truncate font-display text-2xl font-bold sm:text-3xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              SETHSUWA
            </motion.span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            {customer ? (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className={linkClass}>
                  My Profile
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-brand-charcoal transition hover:bg-brand-cream"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLoginClick}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-maroon"
              >
                <LogIn size={16} /> Log in
              </button>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-maroon ring-1 ring-brand-maroon/20 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              className="border-t border-brand-gold/20 bg-white px-4 py-4 md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-3">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                ))}
                {customer ? (
                  <>
                    <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                      <span className="inline-flex items-center gap-2">
                        <UserRound size={16} /> My Profile
                      </span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="inline-flex w-fit rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-brand-charcoal"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white"
                  >
                    <LogIn size={16} /> Log in
                  </button>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <Outlet />
      </main>

      <CustomerLoginModal />

      <footer id="location" className="border-t border-brand-leaf/15 bg-white text-brand-charcoal">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Sethsuwa logo" className="h-14 w-14 object-contain" />
              <span className="font-display text-2xl font-bold text-black">SETHSUWA</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Traditional Sri Lankan Ayurveda treatment care shaped by heritage, trust, and attentive hospitality.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://web.facebook.com/pranajeewaoil/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-leaf text-white transition hover:bg-brand-gold hover:text-brand-charcoal"
                aria-label="Sethsuwa Facebook"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="https://www.instagram.com/p/DXYjelWE1dh/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-red text-white transition hover:bg-brand-gold hover:text-brand-charcoal"
                aria-label="Sethsuwa Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.pranajeewa.lk/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-indigo text-white transition hover:bg-brand-gold hover:text-brand-charcoal"
                aria-label="Sethsuwa website"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-brand-leaf">Address</h3>
            <div className="mt-5 flex gap-3 text-sm leading-7 text-slate-600">
              <MapPin className="mt-1 shrink-0 text-brand-red" size={18} />
              <p>
                Sethsuwa Pranajeewa
                <br />
                No 258/19
                <br />
                Vihara Mawatha
                <br />
                Batalanda Road
                <br />
                Makola South
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-brand-leaf">Contacts</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <a href="mailto:info@pranajeewa.lk" className="flex items-center gap-3 transition hover:text-brand-red">
                <Mail size={18} /> info@pranajeewa.lk
              </a>
              <a href="mailto:pranajeewa@hotmail.com" className="flex items-center gap-3 transition hover:text-brand-red">
                <Mail size={18} /> pranajeewa@hotmail.com
              </a>
              <p className="flex items-start gap-3">
                <Phone className="mt-1" size={18} />
                <span>
                  (+94) 112 964023
                  <br />
                  (+94) 112 962008
                  <br />
                  Hotline: +94 (70) 4744700
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-leaf/15 px-4 py-5 text-center text-xs text-slate-500">
          <span>Copyright {new Date().getFullYear()} Sethsuwa. All rights reserved.</span>
          <span className="mx-2 hidden sm:inline">|</span>
          <span className="mt-2 block sm:mt-0 sm:inline">
            Developed by{" "}
            <a
              href="https://sites-nap.vercel.app/"
              className="font-bold text-brand-red transition hover:text-brand-leaf"
              target="_blank"
              rel="noreferrer"
            >
              SiteSnap
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
