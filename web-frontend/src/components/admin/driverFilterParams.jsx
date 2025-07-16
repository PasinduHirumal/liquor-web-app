export const buildDriverQueryParams = (filters) => {
    const params = {};

    if (filters.isActive !== undefined) {
        params.isActive = filters.isActive === 'true' || filters.isActive === true;
    }

    if (filters.isAvailable !== undefined) {
        params.isAvailable = filters.isAvailable === 'true' || filters.isAvailable === true;
    }

    if (filters.isDocumentVerified !== undefined) {
        params.isDocumentVerified = filters.isDocumentVerified === 'true' || filters.isDocumentVerified === true;
    }

    return params;
};
