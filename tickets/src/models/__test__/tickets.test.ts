import { Ticket } from '../tickets'

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error('should not reach here');
})


it('updates version number when document is saved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123'
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})