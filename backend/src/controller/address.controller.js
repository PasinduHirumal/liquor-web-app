import AddressService from '../services/address.service.js';
import UserService from '../services/users.service.js';

const addressService = new AddressService();
const userService = new UserService();

const createAddress = async (req, res) => {
	try {
        const addressData = {
            userId: req.user.id,
            ...req.body
        };

        const address = await addressService.create(addressData);
        if (!address) {
            return res.status(400).json({ success: false, message: "Failed to create address"});
        }

        const user = await userService.findById(req.user.id);

        // Update the user's addresses array with the new address ID
        try {
            const currentAddresses = user.addresses || [];
            const updatedAddresses = [...currentAddresses, address.id];

            await userService.updateById(req.user.id, {
                addresses: updatedAddresses
            });
        } catch (updateError) {
            console.error(`Error updating user ${user.email} with new address:`, updateError.message);
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Address created successfully",
            data: address
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createAddress, };