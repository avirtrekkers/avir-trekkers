import { useParams } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold font-heading text-text mb-8">
        Book Your Trek
      </h1>
      <p className="text-text-light">
        Booking form for trek <span className="font-semibold">{id}</span> coming
        soon.
      </p>
    </div>
  );
}
