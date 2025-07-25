import AddressService from '../services/address.service.js';

const addressService = new AddressService();

// SOLUTION 1: If your data includes userId
const populateAddress = async (data, userId) => {
    const populateOne = async (category) => {
        // Check if delivery_address_id exists and is not null/undefined
        if (!category || !category.delivery_address_id) {
            return category;
        }

        // Handle both string ID and object with ID
        const addressId = typeof category.delivery_address_id === 'string' 
            ? category.delivery_address_id 
            : category?.delivery_address_id?.id;
            
        if (addressId && userId) {
            try {
                const address = await addressService.findById(userId, addressId);
                if (address) {
                    category.delivery_address_id = {
                        id: address.id,
                        savedAddress: `${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`,
                        streetAddress: address.streetAddress,
                    };
                } else {
                    category.delivery_address_id = null;
                }
            } catch (error) {
                console.error('Error fetching delivery address id:', error);
                category.delivery_address_id = null;
            }
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

// SOLUTION 2: If userId is included in each data item
const populateAddressWithUserIdInData = async (data) => {
    const populateOne = async (category) => {
        // Add null/undefined checks
        if (!category) {
            console.warn('populateAddress: Received null/undefined category');
            return category;
        }

        // Check if delivery_address_id exists and is not null/undefined
        if (!category.delivery_address_id) {
            console.warn('Order missing delivery_address_id:', category.id || 'unknown ID');
            return category;
        }

        // Handle both string ID and object with ID
        const addressId = typeof category.delivery_address_id === 'string' 
            ? category.delivery_address_id 
            : category?.delivery_address_id?.id;
            
        // Try multiple possible user ID field names
        const userId = category.userId || category.user_id || category.customerId || category.customer_id;
            
        if (addressId && userId) {
            try {
                const address = await addressService.findById(userId, addressId);
                if (address) {
                    category.delivery_address_id = {
                        id: address.id,
                        savedAddress: `${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`,
                        streetAddress: address.streetAddress,
                    };
                } else {
                    console.warn(`Address not found for userId: ${userId}, addressId: ${addressId}`);
                    category.delivery_address_id = null;
                }
            } catch (error) {
                console.error('Error fetching delivery address:', error);
                category.delivery_address_id = null;
            }
        } else {
            console.warn('Missing addressId or userId:', { addressId, userId, orderId: category.id });
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export { populateAddress, populateAddressWithUserIdInData };