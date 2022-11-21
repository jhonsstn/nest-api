const dbEnvironment = {
  development: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
  },
  test: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.TEST_DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
  },
};

export default dbEnvironment;
