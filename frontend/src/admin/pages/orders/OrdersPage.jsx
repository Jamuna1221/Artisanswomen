import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import Table from '../../components/ui/Table';
import { Eye, Check } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getOrders();
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ["Order ID", "Buyer", "Total", "Payment", "Status", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td>#{item._id.slice(-6).toUpperCase()}</td>
      <td>{item.buyerId?.name}</td>
      <td>₹{item.totalAmount}</td>
      <td><span className="status-pill status-active">{item.paymentStatus}</span></td>
      <td><span className="status-pill status-pending">{item.orderStatus}</span></td>
      <td>
        <div className="action-btns">
          <button className="icon-btn view"><Eye size={18} /></button>
          <button className="icon-btn edit" title="Move to next status"><Check size={18} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Order Monitoring</h2>
        <p>Track payments and shipping statuses</p>
      </div>
      <Table headers={headers} data={orders} renderRow={renderRow} loading={loading} />
    </div>
  );
};

export default OrdersPage;
