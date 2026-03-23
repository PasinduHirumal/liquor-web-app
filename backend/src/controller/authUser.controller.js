import UserService from '../services/users.service.js';
import generateToken from '../utils/createToken.js';
import { uploadSingleImage } from '../utils/firebaseStorage.js';

const userService = new UserService();

const register = async (req, res) => {
    try {
        const { email, phoneNumber, profilePicUrl } = req.body;

        const userByEmail  = await userService.findByEmail(email);
        const userByPhone = await userService.findByPhone(phoneNumber);

        if (userByEmail || userByPhone) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (profilePicUrl !== undefined) {
            try {
                const imageUrls = await uploadSingleImage(profilePicUrl, 'profile_pics');
                req.body.profilePicUrl = imageUrls;
                console.log('✅ Images uploaded successfully:', imageUrls);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload images" 
                });
            }
        }

        const user = await userService.create(req.body);

        // block password displaying
        const { password, ...userWithoutPassword } = user;

        return res.status(201).json({ success: true, message: "Your account registered successfully", data: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, phoneNumber, password } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ success: false, message: "Either Email or Phone is required"});
        }
    
        let user;
        if (email !== undefined) {
            user = await userService.findByEmail(email);
        } else if (phoneNumber !== undefined) {
            user = await userService.findByPhone(phoneNumber);
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
        if (!user.isAccountCompleted) {
            return res.status(400).json({ success: false, message: "Your account is not completed" });
        }

        // create JWT token
        const payload = {
            id: user.user_id,
            email: user.email,
            username: `${user.firstName} ${user.lastName}`,
            role: user.role,
        };

        generateToken(payload, res); 

        // block password displaying
        user.password = undefined;

        return res.status(200).json({ success: true, message: "Login successful", data: user });
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    console.log('Checking auth for user ID:', req.user.id);

    const user = await userService.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found"});
    }

    const userData = {
        id: user.user_id,
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