const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the admin schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    },
    isAuthorized: {
        type: Boolean,
        default: true,
    },
});

// Middleware to hash the password before saving
adminSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare the password
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};



// Export the admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
