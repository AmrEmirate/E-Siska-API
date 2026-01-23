import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: UserRole;
        adminId?: string;
        guruId?: string;
        siswaId?: string;
      };
    }
  }
}
