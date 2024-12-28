class OrderService {
  key = 'Order';
  constructor() {
  }

  async createOrder() {
    return {
      statusCode: 200,
      data: {
        message: 'Order created successfully from service',
        order: {},
      },
    };
  }
}

module.exports = OrderService;