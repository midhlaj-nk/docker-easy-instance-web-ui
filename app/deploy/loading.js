/**
 * Deploy Page Loading Component
 * Displayed while deploy page is loading
 */
export default function DeployLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary-color)] mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-[#333] mb-2">Loading Deployment Wizard</h2>
        <p className="text-slate-600">Preparing templates...</p>
      </div>
    </div>
  );
}


