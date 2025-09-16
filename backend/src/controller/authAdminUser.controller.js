import AdminUserService from '../services/adminUsers.service.js';
import CompanyService from "../services/company.service.js";
import generateToken from '../utils/createToken.js';

const adminService = new AdminUserService();
const companyService = new CompanyService();

const register = async (req, res) => {
    try {
        const { email, phone, where_house_id } = req.body;

        const existingAdmin  = 
            (email && await adminService.findByEmail(email)) || 
            (phone && await adminService.findByPhone(phone));

        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (where_house_id !== undefined) {
            const warehouse = await companyService.findById(where_house_id);
            if (!warehouse) {
                return res.status(400).json({ success: false, message: "Invalid warehouse id" });
            }
            if (!warehouse.isActive) {
                return res.status(400).json({ success: false, message: "Warehouse is in Not-Active" });
            }
        } else {
            req.body.where_house_id = null;
        }

        const adminData = { ...req.body };

        const admin = await adminService.create(adminData);
        if (!admin) {
            return res.status(500).json({ success: false, message: "Failed to create admin" });
        }

        // block password displaying
        const { password, ...adminWithoutPassword } = admin;

        return res.status(201).json({ success: true, message: "Admin account registered successfully", data: adminWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ success: false, message: "Either Email or Phone is required"});
        }
    
        const user = email? 
            await adminService.findByEmail(email) : 
            await adminService.findByPhone(phone);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const isMatch = await adminService.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const validations = [
            { condition: !user.isAccountVerified, message: "Your account is not verified" },
            { condition: !user.isAdminAccepted, message: "Your account is not accepted by admin panel" },
            { condition: !user.isActive, message: "Your account is not in active" }
        ];

        for (const validation of validations) {
            if (validation.condition) {
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        // create JWT token
        const payload = {
            id: user.id,
            email: user.email,
            username: `${user.firstName} ${user.lastName}`,
            role: user.role,
            where_house: user.where_house_id || "N/A",
        };

        generateToken(payload, res); 

        // block password displaying
        const { password: userPassword, ...adminWithoutPassword } = user;

        return res.status(200).json({ success: true, message: "Login successful", data: adminWithoutPassword });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        return res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            path: '/' 
        }).status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Logout error:', error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const checkAuth = async (req, res) => {
  try {
    const user = await adminService.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isAdminAccepted || !user.isActive || !user.isAccountVerified) {
        return res.status(403).json({ success: false, message: "Account not authorized - please contact administrator" });
    }

    const userData = {
        id: user.id,
        email: user.email,
        username: `${user.firstName} ${user.lastName}`,
        role: user.role,
        where_house: user.where_house_id || "N/A",
    };
    
    return res.status(200).json({ success: true, message: "Authenticated user: ", data: userData});
  } catch (error) {
    console.error("Check Auth error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export { register, login, logout, checkAuth };