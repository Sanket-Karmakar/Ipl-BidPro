const asyncHandler = (fxn) => async (req, res, next) => {
    try {
        await fxn(req, res, next);
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

export { asyncHandler };

