const Admin = require("../modals/admin")
//console.log('Admin model:', Admin);

const admin_reg = async (req, res) => {
    const {name, email, password} = req.body
    
    if (!email || !name || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const existingAdmin = await Admin.findOne({email})
        if (existingAdmin)
            {
                res.status(404).json({message:'admin already exist'})
            }
            const newAdmin = new Admin({
                name,
                email,
                password, // The password will be hashed in the pre-save middleware
            });
    
            // Save the new admin to the database
            await newAdmin.save();
    
            // Respond with a success message
            return res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    
        } catch (error) {
            console.error('Error registering admin:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
            
module.exports = {
    admin_reg,
}