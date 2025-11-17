export default function StatisticsChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] shadow-md">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-600 dark:text-brand-400">
          IoT Health App
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Smart Monitoring • Real-Time Insights • Connected Care
        </p>
      </div>

      {/* BEAUTIFUL SLOGAN BOX */}
      <div className="mt-8 p-6 rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 shadow-sm text-center">
        <p className="text-lg font-semibold text-brand-600 dark:text-brand-400">
          “Empowering Health Through Intelligent IoT Data”
        </p>
      </div>
    </div>
  );
}
