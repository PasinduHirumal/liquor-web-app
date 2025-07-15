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
        
        return res.status(201).json({ 
            success: true, 
            message: "Address created successfully",
            data: address
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllAddressesForUser = async (req, res) => {
	try {
        const userId = req.user.id;
        const { isActive } = req.query;

        const addresses = await addressService.findByFilter('userId', '==', userId);
        if (!addresses) {
            return res.status(400).json({ success: false, message: "Failed to find addresses for user"});
        }

        let filteredAddresses;
        let filterDescription = [];
        if (isActive !== undefined) {
            // Convert string to boolean since query params are strings
            const isActiveBoolean = isActive === 'true';
            filteredAddresses = addresses.filter(address => address.isActive === isActiveBoolean);
            filterDescription.push(`isActive: ${isActive}`);
        } else {
            filteredAddresses = addresses;
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Addresses found", 
            count: filteredAddresses.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: filteredAddresses
        });
    } catch (error) {
        console.error("Find addresses for user error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAddress = async (req, res) => {
	try {
        const addressId = req.params.id;

        const address = await addressService.findById(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found"});
        }

        if (address.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update" });
        }

        const addressData = { ...req.body };
        const updatedAddress = await addressService.updateById(addressId, addressData);
        
        return res.status(200).json({ success: true, message: "Address updated successfully", data: updatedAddress});
    } catch (error) {
        console.error("Update address error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createAddress, getAllAddressesForUser, updateAddress};