type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  OWNER: ["view", "create", "edit", "delete", "manage-members"],
  ADMIN: ["view", "create", "edit", "delete"],
  MEMBER: ["view", "create", "edit"],
} as const;

export function hasPermission(
  user: { id: string; role: Role },
  permission: Permission,
): boolean {
  return (ROLES[user.role] as readonly Permission[]).includes(permission);
}
