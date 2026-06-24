import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[68vh] items-center justify-center bg-white px-4 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-brand-gold">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-brand-maroon">Page not found</h1>
        <Link to="/" className="mt-7 inline-flex rounded-md bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-maroon">
          Return Home
        </Link>
      </div>
    </section>
  );
}
