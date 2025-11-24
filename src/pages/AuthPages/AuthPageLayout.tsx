import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        
        {/* Main Auth Form */}
        {children}

        {/* Right Side Section */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">

            {/* Background Grid */}
            <GridShape />

            {/* Branding Section */}
            <div className="flex flex-col items-center max-w-xs">
            

              <h2 className="mb-2 text-xl font-semibold text-white dark:text-gray-200 text-center">
                Smart Health IoT Platform
              </h2>

              <p className="text-center text-gray-400 dark:text-white/60">
                Connect. Monitor. Heal — Your intelligent IoT-powered health dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
