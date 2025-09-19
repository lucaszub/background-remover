"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function DesktopAuth() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setShowDropdown(false);
  };

  if (status === "loading") {
    return (
      <div className="hidden md:flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="hidden md:flex items-center relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-neutral-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center">
              <span className="text-neutral-200 text-sm font-medium">
                {session.user?.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-10 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 w-48 z-20">
              <div className="px-4 py-2 border-b border-neutral-700">
                <p className="text-neutral-200 text-sm font-medium truncate">
                  {session.user?.name}
                </p>
                <p className="text-neutral-400 text-xs truncate">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-neutral-300 hover:bg-neutral-700 text-sm"
              >
                Déconnexion
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center">
      <button
        onClick={handleSignIn}
        className="bg-white cursor-pointer text-neutral-900 hover:bg-neutral-200 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
      >
        Login
      </button>
    </div>
  );
}
