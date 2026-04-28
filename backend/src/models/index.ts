import User from './User';
import Task from './task/Task';
import TaskBoard from './task/TaskBoard';
import TaskGroup from './task/TaskGroup';
import Event from './Event';

User.hasMany(TaskBoard, { foreignKey: 'userId', onDelete: 'CASCADE' });
TaskBoard.belongsTo(User, { foreignKey: 'userId' });

TaskBoard.hasMany(TaskGroup, { foreignKey: 'taskBoardId', onDelete: 'CASCADE' });
TaskGroup.belongsTo(TaskBoard, { foreignKey: 'taskBoardId' });

TaskGroup.hasMany(Task, { foreignKey: 'taskGroupId', onDelete: 'CASCADE' });
Task.belongsTo(TaskGroup, { foreignKey: 'taskGroupId' });

User.hasMany(Event, { foreignKey: 'userId', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Task, TaskBoard, TaskGroup, Event };
