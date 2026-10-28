import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");
const API = `${API_BASE_URL}/api/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    { productId: "", quantity: 1 },
  ]);
  const [message, setMessage] = useState("");

  // Load products from backend
  useEffect(() => {
    fetch(API)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setMessage("Cannot connect to the backend. Check the API URL and backend availability.");
      });
  }, []);

  // Add another item row
  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  // Change selected product or quantity
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  // Remove an item row
  const removeItem = (index) => {
    if (items.length === 1) {
      setItems([{ productId: "", quantity: 1 }]);
      return;
    }

    setItems(items.filter((item, i) => i !== index));
  };

  // Calculate item totals
  const billItems = items.map((item) => {
    const product = products.find(
      (p) => String(p.id) === item.productId
    );

    const quantity = Number(item.quantity) || 0;
    const price = product ? Number(product.price) : 0;

    return {
      productId: item.productId,
      name: product ? product.name : "",
      price,
      quantity,
      total: price * quantity,
    };
  });

  // Calculate subtotal
  const subtotal = billItems.reduce(
    (total, item) => total + item.total,
    0
  );

  // Apply 10% discount only if subtotal is greater than ₹1,000
  const discount = subtotal > 1000 ? subtotal * 0.10 : 0;

  // Calculate final amount
  const finalAmount = subtotal - discount;

  // Print the bill
  const printBill = () => {
    if (customerName.trim() === "") {
      setMessage("Please enter the customer's name.");
      return;
    }

    const hasInvalidItem = items.some(
      (item) =>
        !item.productId ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
    );

    if (hasInvalidItem) {
      setMessage("Select a product and enter a quantity of at least 1.");
      return;
    }

    setMessage("");
    window.print();
  };

  return (
    <div className="container">
      <header className="page-header no-print">
        <h1>Simple Billing Application</h1>
        <p>Select products, calculate the bill, and print the receipt.</p>
      </header>

      <section className="customer-section no-print">
        <h2>Customer Details</h2>

        <label htmlFor="customerName">Customer Name</label>
        <input
          id="customerName"
          type="text"
          placeholder="Enter customer's name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </section>

      <section className="items-section no-print">
        <div className="section-heading">
          <h2>Select Products</h2>

          <button className="add-button" onClick={addItem}>
            + Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div className="item-form-row" key={index}>
            <div className="form-group">
              <label>Product</label>

              <select
                value={item.productId}
                onChange={(e) =>
                  updateItem(index, "productId", e.target.value)
                }
              >
                <option value="">Choose a product</option>

                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.name} - ₹
                    {Number(product.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", e.target.value)
                }
              />
            </div>

            <button
              className="remove-button"
              onClick={() => removeItem(index)}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}

        {products.length === 0 && (
          <p>No products available. Check your backend and database.</p>
        )}

        {message && <p className="message">{message}</p>}
      </section>

      <section className="bill-section" id="printable-bill">
        <div className="bill-heading">
          <h2>SHOP BILL</h2>
          <p>Customer: {customerName.trim() || "Not entered"}</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Item Total</th>
              </tr>
            </thead>

            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || "—"}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bill-totals">
          <p>
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </p>

          <p>
            <span>Discount (10%)</span>
            <strong>- ₹{discount.toFixed(2)}</strong>
          </p>

          {subtotal > 1000 ? (
            <p className="discount-note">
              10% discount applied because subtotal exceeds ₹1,000.
            </p>
          ) : (
            <p className="discount-note">
              No discount: subtotal must be greater than ₹1,000.
            </p>
          )}

          <p className="final-total">
            <span>Final Amount</span>
            <strong>₹{finalAmount.toFixed(2)}</strong>
          </p>
        </div>

        <p className="thank-you">Thank you for shopping with us!</p>
      </section>

      <div className="print-actions no-print">
        <button className="print-button" onClick={printBill}>
          Print Bill
        </button>
      </div>
    </div>
  );
}

export default App;