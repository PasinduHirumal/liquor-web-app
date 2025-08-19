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

// SOLUTION 2: Fixed version for your data structure
const populateAddressWithUserIdInData = async (data) => {
    const populateOne = async (category) => {
        // Add null/undefined checks
        if (!category) {
            console.warn('populateAddress: Received null/undefined category');
            return category;
        }

        // Check if delivery_address_id exists and is not null/undefined
        if (!category.delivery_address_id) {
            console.warn('Order missing delivery_address_id:', category.order_id || category.id || 'unknown ID');
            return category;
        }

        // Handle both string ID and object with ID
        const addressId = typeof category.delivery_address_id === 'string' 
            ? category.delivery_address_id 
            : category?.delivery_address_id?.id;
            
        // FIXED: Handle nested user_id object structure
        let userId;
        if (category.user_id) {
            if (typeof category.user_id === 'string') {
                userId = category.user_id;
            } else if (category.user_id.id) {
                // Handle the nested structure from your JSON
                userId = category.user_id.id;
            }
        }
        
        // Fallback to other possible user ID field names
        if (!userId) {
            userId = category.userId || category.customerId || category.customer_id;
        }
            
        if (addressId && userId) {
            try {
                const address = await addressService.findById(userId, addressId);
                if (address) {
                    category.delivery_address_id = {
                        id: address.id,
                        savedAddress: `${address.city || ''}, ${address.state || ''}, ${address.postalCode || ''}, ${address.country || ''}`.replace(/^,\s*|,\s*$/g, ''), // Remove leading/trailing commas
                        streetAddress: address.streetAddress || '',
                        // Include full address object for debugging
                        //fullAddress: address
                    };
                } else {
                    console.warn(`Address not found for userId: ${userId}, addressId: ${addressId}`);
                    category.delivery_address_id = null;
                }
            } catch (error) {
                console.error('Error fetching delivery address:', error.message);
                category.delivery_address_id = null;
            }
        } else {
            console.warn('Missing addressId or userId:', { 
                addressId, 
                userId, 
                orderId: category.order_id || category.id,
                hasDeliveryAddressId: !!category.delivery_address_id,
                hasUserId: !!category.user_id
            });
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

// SOLUTION 3: Alternative version that handles multiple user ID formats
const populateAddressRobust = async (data) => {
    const extractUserId = (item) => {
        // Handle different user ID formats
        if (item.user_id) {
            if (typeof item.user_id === 'string') return item.user_id;
            if (typeof item.user_id === 'object' && item.user_id.id) return item.user_id.id;
        }
        return item.userId || item.customerId || item.customer_id || null;
    };

    const extractAddressId = (item) => {
        if (!item.delivery_address_id) return null;
        if (typeof item.delivery_address_id === 'string') return item.delivery_address_id;
        if (typeof item.delivery_address_id === 'object' && item.delivery_address_id.id) {
            return item.delivery_address_id.id;
        }
        return null;
    };

    const populateOne = async (item) => {
        if (!item) return item;

        const userId = extractUserId(item);
        const addressId = extractAddressId(item);

        if (!addressId) {
            // If no delivery_address_id, keep it as null
            return item;
        }

        if (!userId) {
            console.warn('No userId found for order:', item.order_id || item.id);
            item.delivery_address_id = null;
            return item;
        }

        try {
            const address = await addressService.findById(userId, addressId);
            if (address) {
                item.delivery_address_id = {
                    id: address.id,
                    savedAddress: [address.city, address.state, address.postalCode, address.country]
                        .filter(Boolean)
                        .join(', '),
                    streetAddress: address.streetAddress || '',
                    city: address.city || '',
                    state: address.state || '',
                    postalCode: address.postalCode || '',
                    country: address.country || ''
                };
            } else {
                console.warn(`Address ${addressId} not found for user ${userId}`);
                item.delivery_address_id = null;
            }
        } catch (error) {
            console.error(`Error fetching address ${addressId} for user ${userId}:`, error.message);
            item.delivery_address_id = null;
        }

        return item;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export { populateAddress, populateAddressWithUserIdInData, populateAddressRobust };