import mongoose from 'mongoose';
import logger from './logger.js';
try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_IP}/?authSource=%24external&authMechanism=MONGODB-X509`, {
        tlsAllowInvalidCertificates: false,
        tlsCertificateKeyFile: process.env.MONGODB_KEY_PATH,
        authMechanism: 'MONGODB-X509',
        authSource: '$external'
    });
    logger.info('Connected to MongoDB Atlas');
}
catch (e) {
    logger.fatal(e, 'Could not connect to MongoDB Atlas');
    process.exit(1);
}
const exp = null;
export default exp;
//# sourceMappingURL=atlasConnect.js.map