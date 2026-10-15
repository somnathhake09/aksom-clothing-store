export default function CartItem({ item, onRemove }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center">
        <div className="col-md-2">
          <img
            src={item.image}
            alt={item.name}
            className="img-fluid rounded-start"
            style={{ maxHeight: "90px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-7">
          <div className="card-body py-2">
            <h6 className="card-title mb-1">{item.name}</h6>
            <p className="mb-0 text-muted">
              ₹{item.price} × {item.quantity}
            </p>
          </div>
        </div>

        <div className="col-md-3 text-end pe-3">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
