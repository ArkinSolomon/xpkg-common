import { pino } from 'pino';
const level = process.env.NODE_ENV === 'production' ? 'info' : 'trace';
const logger = pino({ level });
export default logger;
//# sourceMappingURL=logger.js.map