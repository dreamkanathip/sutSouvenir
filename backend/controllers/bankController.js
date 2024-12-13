const prisma = require("../configs/prisma");

exports.addDestBank = async(req, res) => {
    try {
        const { bank, bankNumber, name, branch } = req.body
        const destBank = await prisma.destinationBank.create({
            data: {
                bank: bank,
                bankNumber: bankNumber,
                name: name,
                branch: branch,
            }
        })
        res.send(destBank)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.addOriginBank = async(req, res) => {
    try {
        const { bank } = req.body
        const originBank = await prisma.originBank.create({
            data: {
                bank: bank
            }
        })
        res.send(originBank)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.updateDestBank = async (req, res) => {
    try {
        const { id } = req.params;
        const { bank, bankNumber, name, branch } = req.body;
        const updatedDestBank = await prisma.destinationBank.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                bank: bank,
                bankNumber: bankNumber,
                name: name,
                branch: branch,
             },
        });
        res.send(updatedDestBank);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateOriginBank = async (req, res) => {
    try {
        const { id } = req.params;
        const { bank } = req.body;
        const updatedOriginBank = await prisma.originBank.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                bank: bank
            },
        });
        res.send(updatedOriginBank);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.deleteDestBank =  async(req, res) => {
    try {
        const { id } = req.params
        const deleteDestBank = await prisma.destinationBank.delete({
            where: {
                id: Number(id)
            }
        })
        res.send("delete success", deleteDestBank)
    } catch(err) {
        console.err(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.deleteOriginbank = async(req, res) => {
    try {
        const { id } = req.params
        const deleteOriginBank = await prisma.originBank.delete({
            where: {
                id: Number(id)
            }
        })
        res.send("delete success", deleteOriginBank)
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getDestBank = async(req, res) => {
    try {
        const destBank = await prisma.destinationBank.findMany()
        res.send(destBank)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.getOriginBank = async(req, res) => {
    try {
        const originBank = await prisma.originBank.findMany()
        res.send(originBank)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}