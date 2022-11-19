const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'BCRYPT_SALT':
        return 10;
      case 'JWT_EXPIRATION_TIME':
        return '24h';
      case 'JWT_SECRET':
        return 'any_secret';
    }
  },
};

export default mockedConfigService;
