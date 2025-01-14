const prisma = require("../configs/prisma");

exports.createShipping = async (req, res) => {
    try {
        const { company, fees } = req.body;
        const shipping = await prisma.shipping.create({
            data: {
                company,
                fees: Number(fees),
            },
        });
        res.send(shipping);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllShipping = async (req, res) => {
    try {
        const shippings = await prisma.shipping.findMany();
        res.send(shippings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getShippingById = async (req, res) => {
    try {
        const { id } = req.params;
        const shipping = await prisma.shipping.findUnique({
            where: { id: Number(id) },
        });

        if (!shipping) {
            return res.status(404).json({ message: "Shipping not found" });
        }

        res.send(shipping);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateShipping = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, fees } = req.body;

        const updatedShipping = await prisma.shipping.update({
            where: { id: Number(id) },
            data: {
                company,
                fees: Number(fees),
            },
        });

        res.send(updatedShipping);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteShipping = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.shipping.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Shipping entry deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

