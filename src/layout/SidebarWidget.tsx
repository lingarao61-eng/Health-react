export default function SidebarWidget() {
  return (
    <div
      className="
        mx-auto mb-10 w-full max-w-60 rounded-2xl 
        bg-gray-50 px-4 py-5 text-center 
        dark:bg-white/[0.05]"
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Smart Health IoT App
      </h3>

      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Monitor patient vitals in real-time using secure IoT devices and cloud-powered analytics.
      </p>

      <div
        className="flex items-center justify-center p-3 font-medium text-white 
        rounded-lg bg-brand-500 text-theme-sm select-none"
      >
        Stay Healthy. Stay Connected.
      </div>
    </div>
  );
}
