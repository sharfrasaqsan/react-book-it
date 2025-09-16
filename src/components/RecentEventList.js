import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const RecentEventList = () => {
  const { events } = useData();
  const recent = Array.isArray(events) ? [...events].slice(-8).reverse() : [];

  return (
    <section id="recent" className="py-5 bg-light border-top">
      <div className="container">
        <div className="d-flex align-items-end justify-content-between mb-3">
          <div>
            <span className="eyebrow">Fresh this week</span>
            <h2 className="fw-bold mt-1">Recently added</h2>
          </div>
          <Link to="/events" className="btn btn-outline-primary lift-on-hover">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="alert alert-info mb-0">
            No events yet — check back soon.
          </div>
        ) : (
          <div className="table-responsive rounded-4 soft-shadow bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th className="d-none d-md-table-cell">Date</th>
                  <th className="d-none d-lg-table-cell">Time</th>
                  <th>Location</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((ev) => (
                  <tr key={ev.id}>
                    <td className="fw-semibold text-break">{ev.title}</td>
                    <td className="text-nowrap d-none d-md-table-cell">
                      {ev.date}
                    </td>
                    <td className="text-nowrap d-none d-lg-table-cell">
                      {ev.time}
                    </td>
                    <td className="text-break">{ev.location}</td>
                    <td className="text-end">
                      <Link
                        to={`/event/${ev.id}`}
                        className="btn btn-sm btn-primary lift-on-hover"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
export default RecentEventList;
