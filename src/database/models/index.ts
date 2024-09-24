import Account_Confirmation from './account_confirmation';
import Phone_Number from './phone_number';
import Role from './role';
import User from './user';

// Many-to-Many Associations between Users and Roles
User.belongsToMany(Role, {
    through: 'User_Roles', // Join table name
    as: 'roles', // Alias for roles
    foreignKey: 'userId', // Foreign key in the join table
    onDelete: 'CASCADE', // Cascade deletes
    onUpdate: 'CASCADE', // Cascade updates
});
Role.belongsToMany(User, {
    through: 'User_Roles', // Join table name
    as: 'users', // Alias for users
    foreignKey: 'roleId', // Foreign key in the join table
    onDelete: 'CASCADE', // Cascade deletes
    onUpdate: 'CASCADE', // Cascade updates
});

// One-to-One Associations between User and Phone Number
User.hasOne(Phone_Number, {
    foreignKey: 'userId',
    as: 'phoneNumber',
    onDelete: 'CASCADE', // Cascade deletes
    onUpdate: 'CASCADE', // Cascade updates
});
Phone_Number.belongsTo(User, {
    foreignKey: 'userId',
    as: 'phoneNumber',
});

// One-to-One Associations between User and Account Confirmation
User.hasOne(Account_Confirmation, {
    foreignKey: 'userId',
    as: 'accountConfirmation',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Account_Confirmation.belongsTo(User, {
    foreignKey: 'userId',
    as: 'accountConfirmation',
});

export { Role, User, Phone_Number, Account_Confirmation };
