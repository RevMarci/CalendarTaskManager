import User from './User';
import Task from './Task';
import Event from './Event';

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Event, { foreignKey: 'userId', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'userId' });

export { User, Task, Event };