import { prisma } from "@/lib/prisma";

export async function logAudit(
  action: string,
  entity: string,
  entityId: string,
  userId?: string,
  details?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
}
