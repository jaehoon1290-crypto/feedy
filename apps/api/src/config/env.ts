import 'dotenv/config';
const required = (name: string) => { const value = process.env[name]; if (!value) throw new Error(`${name} 환경변수가 필요합니다.`); return value; };
export const env = { nodeEnv: process.env.NODE_ENV ?? 'development', port: Number(process.env.PORT ?? 4000), mongoUri: required('MONGODB_URI'), jwtSecret: required('JWT_SECRET'), jwtRefreshSecret: required('JWT_REFRESH_SECRET'), clientUrl: required('CLIENT_URL'), socketCorsOrigin: required('SOCKET_CORS_ORIGIN') };
