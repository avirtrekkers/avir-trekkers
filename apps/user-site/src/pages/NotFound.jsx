import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold font-heading text-primary mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold font-heading text-text mb-4">
        Page Not Found
      </h2>
      <p className="text-text-light mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on the trail.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
}
