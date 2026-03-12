
const mongoose = require('mongoose');

const { roles, users } = require('./data');
const Role = require('../schemas/roles');
const User = require('../schemas/users');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/NNPTUD-C5';

async function upsertRole(role) {
  const _id = new mongoose.Types.ObjectId(role._id);
  await Role.updateOne(
    { _id },
    {
      $setOnInsert: {
        _id,
        name: role.name,
        description: role.description || '',
        isDeleted: role.isDeleted === true,
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function upsertUser(user) {
  const _id = new mongoose.Types.ObjectId(user._id);
  const roleId = new mongoose.Types.ObjectId(user.role);
  await User.updateOne(
    { _id },
    {
      $setOnInsert: {
        _id,
        username: user.username,
        password: user.password,
        email: String(user.email || '').toLowerCase(),
        fullName: user.fullName || '',
        avatarUrl: user.avatarUrl || 'https://i.sstatic.net/l60Hf.png',
        status: user.status === true,
        role: roleId,
        loginCount: Number.isFinite(user.loginCount) ? user.loginCount : 0,
        isDeleted: user.isDeleted === true,
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

async function main() {
  await mongoose.connect(MONGO_URI);

  // Ensure indexes exist for unique fields.
  await Role.init();
  await User.init();

  for (const role of roles) await upsertRole(role);
  for (const user of users) await upsertUser(user);

  const roleCount = await Role.countDocuments({});
  const userCount = await User.countDocuments({});
  console.log(`Seed done. roles=${roleCount} users=${userCount} db=${mongoose.connection.db.databaseName}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});