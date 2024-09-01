import type { NextApiRequest, NextApiResponse } from "next";
import { getUsers } from "@/data/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export default handler;
