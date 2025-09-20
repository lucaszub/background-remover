import MobileMenu from "./MobileMenu";
import DesktopAuth from "./DesktopAuth";

export default function Header() {
  return (
    <>
      <header className="w-full px-6 pt-8 pb-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 animate-fade-in-down"
            style={{ animationDelay: "0.05s", animationDuration: "800ms" }}
          >
            <span className="font-extrabold text-xl tracking-tight bg-neutral-900 rounded-lg px-2 py-0.5 border border-neutral-800 select-none">
              BR
            </span>
            <span className="text-neutral-400 font-medium text-base tracking-tight select-none">
              Background-Remover
            </span>
          </div>

          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center gap-8">
            <nav
              className="flex items-center gap-8 animate-fade-in-down"
              style={{ animationDelay: "0.1s", animationDuration: "800ms" }}
            >
              <a
                href="/gallery"
                className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
              >
                Gallery
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
              >
                API
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium"
              >
                Contact
              </a>
            </nav>
            <DesktopAuth />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </header>
      <div className="border-b border-neutral-800 w-full mb-2"></div>
    </>
  );
}
