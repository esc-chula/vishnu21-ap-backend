import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({
        success: true,
        message: `Server is running watching ${process.env.SHEET_NAME}`,
    });
});

export default router;
