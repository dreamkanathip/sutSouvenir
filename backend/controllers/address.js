const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {

    const { uid } = req.params;

    const { 
        firstName,
        lastName,
        phoneNumber,
        street,
        subDistrict,
        district,
        province,
        postalCode,
    } = req.body;

    const user = await prisma.user.findFirst({
    where: {
        id: Number(uid),
    },
    });

    if (!user || !user.enabled) {
    return res.status(400).json({ message: "User Not found or not Enabled" });
    }

    const address = await prisma.address.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        street: street,
        subDistrict: subDistrict,
        district: district,
        province: province,
        postalCode: postalCode,
        user: {
          connect: { id:user.id }
        }
      },
    });
    res.send(address);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.list = async (req, res) => {
    try {

      const { uid } = req.params;
      const address = await prisma.address.findMany({
        where: {
          userId: Number(uid),
        },
        orderBy: { createdAt: "asc" },
      });
      res.send(address);

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.read = async (req, res) => {
    try {

      const { id } = req.params;
      const address = await prisma.address.findFirst({
        where: {
          id: Number(id),
        },
      });
      res.send(address);

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.remove = async (req, res) => {
    try {
      // code
      const { id } = req.params;

      await prisma.address.delete({
        where: {
          id: Number(id),
        },
      });
  
      res.send("Address Deleted Success");
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};  