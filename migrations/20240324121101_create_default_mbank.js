const logger = require('../src/core/logger')('api');
const { bankAcc } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const accname = 'Administrator';
const accemail = 'admin@example.com';
const accpassword = '123456';

logger.info('Creating default bankAccs');

(async () => {
  try {
    const numbankAccs = await bankAcc.countDocuments({
      accname,
      accemail,
    });

    if (numbankAccs > 0) {
      throw new Error(`Bank Account with this ${accemail} already exists`);
    }

    const hashedPassword = await hashPassword(accpassword);
    await bankAcc.create({
      accname,
      accemail,
      accpassword: hashedPassword,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
