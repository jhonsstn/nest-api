const mockedHasherService = {
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePasswords: jest.fn().mockResolvedValue(true),
};

export default mockedHasherService;
