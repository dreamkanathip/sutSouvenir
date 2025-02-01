const prisma = require("../configs/prisma");

exports.getData = async(req, res) => {
  const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

exports.create = async (req, res) => {
  try {
    const uid = req.user.id;

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

    const hasAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
      },
    });

    const address = await prisma.address.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        street: street,
        subDistrict: subDistrict,
        district: district,
        province: province,
        default: hasAddress? false: true,
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
    const uid = req.user.id;
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

exports.getDefaultAddress = async(req, res) => {
  try {
    const uid = req.user.id;
    const address = await prisma.address.findFirst({
      where: {
        userId: Number(uid),
        default: true
      },
    });
    res.send(address);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

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
    const { id } = req.params;
    const uid = req.user.id;

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
    res.status(200).json({message: "Default Address update success", setDefault});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
