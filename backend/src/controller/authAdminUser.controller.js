import AdminUserService from '../services/adminUsers.service.js';
import generateToken from '../utils/createToken.js';

const adminService = new AdminUserService();

const register = async (req, res) => {
    try {
        const { email, phone } = req.body;

        const userByEmail  = await adminService.findByEmail(email);
        const userByPhone = await adminService.findByPhone(phone);

        if (userByEmail || userByPhone) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await adminService.create(req.body);

        // block password displaying
        user.password = undefined;

        return res.status(201).json({ success: true, message: "Admin account registered successfully", data: user });
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
    
        let user;
        if (email !== undefined) {
            user = await adminService.findByEmail(email);
        } else if (phone !== undefined) {
            user = await adminService.findByPhone(phone);
        }
        
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const isMatch = await userService.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Your account is not verified" });
        }

        if (!user.isAdminAccepted) {
            return res.status(400).json({ success: false, message: "Your account is at pending" });
        }

        // create JWT token
        const payload = {
            id: user.id,
            email: user.email,
            username: `${user.firstName} ${user.lastName}`,
            role: user.role,
        };

        generateToken(payload, res); 

        // block password displaying
        user.password = undefined;

        return res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch {
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

    const userData = {
        id: user.id,
        email: user.email,
        username: `${user.firstName} ${user.lastName}`,
        role: user.role,
    };
    
    return res.status(200).json({ success: true, message: "Authenticated user: ", data: userData});
  } catch (error) {
    console.error("Check Auth error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export { register, login, logout, checkAuth };