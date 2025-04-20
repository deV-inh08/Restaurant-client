export const Roles = {
    Owner: 'Owner',
    Employee: 'Employee',
    Guest: 'Guest'
} as const

export const RoleValues = [Roles.Owner, Roles.Employee, Roles.Guest] as const
