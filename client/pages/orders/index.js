


const OrderIndex = ({ orders }) => {

  return (
    <ul>
      {orders.map(order => {
        return <li key={order.id}>
          {order.ticket.title}
          {order.status}
        </li>
      })}
    </ul>
  )
}

OrderIndex.getInitialProps = (client) => {
  const { data } = await client.get('/api/orders');
  return { order: data }
}

export default OrderIndex;