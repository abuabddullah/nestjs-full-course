export default () => ({
  appName: process.env.APP_NAME || 'OOAAOW_APP',
  appVersion: process.env.APP_VERSION || '1.0.0',
  mongoUri:
    process.env.MONGO_URI || 'mongodb://localhost:27017/nest-concept-practice',
  jwtSecret: process.env.JWT_SECRET || 'secretKey',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    tavilyApiKey: process.env.TAVILY_API_KEY || '',
  },
});
