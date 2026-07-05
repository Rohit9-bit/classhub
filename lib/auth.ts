export type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  OWNER: [
    "view:all",
    "create:organization",
    "edit:organization",
    "delete:organization",
    "manage-members:organization",
    "create:subject",
    "edit:subject",
    "delete:subject",
    "create:unit",
    "edit:unit",
    "delete:unit",
    "create:topic",
    "edit:topic",
    "delete:topic",
  ],
  ADMIN: [
    "view:all",
    "edit:organization",
    "create:subject",
    "edit:subject",
    "delete:subject",
    "create:unit",
    "edit:unit",
    "delete:unit",
    "create:topic",
    "edit:topic",
    "delete:topic",
  ],
  MEMBER: ["view:all"],
} as const;

export function hasPermission(
  user: { id: string; role: Role },
  permission: Permission,
): boolean {
  return (ROLES[user.role] as readonly Permission[]).includes(permission);
}
