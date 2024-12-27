class UserService {
    constructor(userRepository, eventPublisher) {
      this.userRepository = userRepository;
      this.eventPublisher = eventPublisher;
    }
  
    async createUser(userId, name, email) {
      const user = {
        id: userId,
        name,
        email
      };
      await this.userRepository.save(user);
      this.eventPublisher.publish(new UserCreatedEvent(user));
    }
  }