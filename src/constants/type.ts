export const Roles = {
    Owner: 'Owner',
    Employee: 'Employee',
    Guest: 'Guest'
} as const

export const RoleValues = [Roles.Owner, Roles.Employee, Roles.Guest] as const


export const DishStatus = {
    Available: 'Available',
    Unavailable: 'Unavailable',
    Hidden: 'Hidden'
} as const


export const DishStatusValues = [DishStatus.Available, DishStatus.Unavailable, DishStatus.Hidden] as const