const prisma = require("../configs/prisma");

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
        postalCode: String(postalCode),
        user: {
          connect: { id: user.id },
        },
      },
    });
    res.status(200).json({ message: "Address Created Successfully" });
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
    const { id } = req.params;

    await prisma.address.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { uid, id } = req.params;

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

    await prisma.address.update({
      where: {
        id: Number(id),
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        street: street,
        subDistrict: subDistrict,
        district: district,
        province: province,
        postalCode: String(postalCode),
        user: {
          connect: { id: user.id },
        },
      },
    });

    res.status(200).json({ message: "Address Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.defaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { default: isDefault } = req.body;

    if (typeof isDefault !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid status format", isDefault });
    }

    const address = await prisma.address.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const setDefault = await prisma.address.update({
      where: {
        id: Number(id),
      },
      data: {
        default: isDefault,
      },
    });
    res.status(200).json("Default Address update success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
