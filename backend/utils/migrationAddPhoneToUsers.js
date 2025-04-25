const mongoose = require('mongoose');

async function migrate() {
  try {
    const mongoURI = 'mongodb+srv://sihaikalnst:082283688931Kal@cluster0.fetevk3.mongodb.net/archive-app?retryWrites=true&w=majority&appName=Cluster0';

    await mongoose.connect(mongoURI);

    const User = mongoose.model('account', new mongoose.Schema({}, { strict: false }));

    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: "unknown" } }
    );

    console.log("Updated " + result.modifiedCount + " user(s) to add phone field.");

    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
