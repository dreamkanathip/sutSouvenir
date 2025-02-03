const prisma = require("../configs/prisma");

exports.addDestBank = async (req, res) => {
  try {
    const { bank, bankNumber, name, branch } = req.body;
    const destBank = await prisma.destinationBank.create({
      data: {
        bank: bank,
        bankNumber: bankNumber,
        name: name,
        branch: branch,
      },
    });
    res.send(destBank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.addOriginBank = async (req, res) => {
  try {
    const { bank } = req.body;
    const originBank = await prisma.originBank.create({
      data: {
        bank: bank,
      },
    });
    res.send(originBank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDestBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { bank, bankNumber, name, branch } = req.body;
    console.log(req.body);
    // ตรวจสอบว่า id ถูกส่งมาหรือไม่ และเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid bank ID" });
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!bank || !bankNumber || !name || !branch) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // ตรวจสอบว่า bank มีอยู่ในฐานข้อมูลหรือไม่
    const existingBank = await prisma.destinationBank.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    // อัปเดตข้อมูล destBank
    const updatedDestBank = await prisma.destinationBank.update({
      where: { id: Number(id) },
      data: { bank, bankNumber, name, branch },
    });

    res.status(200).json(updatedDestBank);
  } catch (err) {
    console.error("Error updating destination bank:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

exports.updateOriginBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { bank } = req.body;
    const updatedOriginBank = await prisma.originBank.update({
      where: {
        id: Number(id),
      },
      data: {
        bank: bank,
      },
    });
    res.send(updatedOriginBank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteDestBank = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า id ถูกส่งมาหรือไม่ และเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid bank ID" });
    }

    // ลบธนาคารปลายทางโดยใช้ Prisma
    const deleteDestBankById = await prisma.destinationBank.delete({
      where: {
        id: Number(id),
      },
    });

    // ตอบกลับเมื่อการลบสำเร็จ
    res.status(200).json({
      message: "Deleted successfully",
      deletedBank: {
        bank: deleteDestBankById.bank,
        bankNumber: deleteDestBankById.bankNumber,
        name: deleteDestBankById.name,
        branch: deleteDestBankById.branch,
      },
    });
  } catch (err) {
    console.error("Error deleting destination bank:", err);

    // กรณีที่ธนาคารไม่มีในฐานข้อมูล
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Destination bank not found" });
    }

    // กรณีข้อผิดพลาดอื่น
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteOriginbank = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า id ถูกส่งมาหรือไม่ และเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid bank ID" });
    }

    // ลบธนาคารต้นทางโดยใช้ Prisma
    const deleteOriginBankById = await prisma.originBank.delete({
      where: {
        id: Number(id),
      },
    });

    // ตอบกลับเมื่อการลบสำเร็จ
    res.status(200).json({
      message: "Deleted successfully",
      originBank: deleteOriginBankById,
    });
  } catch (err) {
    console.error("Error deleting origin bank:", err);

    // กรณีที่ธนาคารไม่มีในฐานข้อมูล
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Origin bank not found" });
    }

    // กรณีข้อผิดพลาดอื่น
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDestBank = async (req, res) => {
  try {
    const destBank = await prisma.destinationBank.findMany();
    res.send(destBank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getOriginBank = async (req, res) => {
  try {
    const originBank = await prisma.originBank.findMany();
    res.send(originBank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
