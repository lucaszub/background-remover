"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 z-50 relative"
        aria-label="Menu"
      >
        <span
          className={`w-6 h-0.5 bg-neutral-400 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-neutral-400 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-neutral-400 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-neutral-900 border-l border-neutral-800 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col pt-20 px-6 space-y-6">
          <a
            href="#"
            className="text-neutral-400 hover:text-neutral-200 transition-colors text-base font-medium py-2"
            onClick={toggleMenu}
          >
            Docs
          </a>
          <a
            href="#"
            className="text-neutral-400 hover:text-neutral-200 transition-colors text-base font-medium py-2"
            onClick={toggleMenu}
          >
            API
          </a>
          <a
            href="#"
            className="text-neutral-400 hover:text-neutral-200 transition-colors text-base font-medium py-2"
            onClick={toggleMenu}
          >
            Contact
          </a>
          <div className="border-t border-neutral-800 pt-6 mt-6">
            {status === "loading" ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border border-neutral-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                      <span className="text-neutral-200 font-medium">
                        {session.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-neutral-200 font-medium text-sm">
                      {session.user?.name}
                    </p>
                    <p className="text-neutral-400 text-xs">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-neutral-400 hover:text-neutral-200 transition-colors text-base font-medium py-2"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSignIn}
                  className="bg-white text-neutral-900 hover:bg-neutral-200 transition-colors text-base font-medium py-3 px-4 rounded-lg w-full"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
