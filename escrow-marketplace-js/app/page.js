export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold">
        Escrow-based Hiring Marketplace
      </h1>
      <p className="max-w-2xl text-gray-600">
        Connect clients and workers with secure escrow-style payments and admin
        oversight. This is a demo-ready frontend you can deploy to Vercel.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/client/signup"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          I&apos;m a Client
        </a>
        <a
          href="/worker/signup"
          className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg"
        >
          I&apos;m a Worker
        </a>
        <a
          href="/admin/login"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
        >
          Admin Login
        </a>
      </div>
    </div>
  );
}
