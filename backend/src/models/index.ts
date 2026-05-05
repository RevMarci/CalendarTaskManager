import User from './User';
import Task from './task/Task';
import TaskBoard from './task/TaskBoard';
import TaskGroup from './task/TaskGroup';
import Event from './Event';
import DailyLog from './DailyLog';
import ExternalCalendar from './ExternalCalendar'; // ÚJ: Importáljuk az új modellt

User.hasMany(TaskBoard, { foreignKey: 'userId', onDelete: 'CASCADE' });
TaskBoard.belongsTo(User, { foreignKey: 'userId' });

TaskBoard.hasMany(TaskGroup, { foreignKey: 'taskBoardId', onDelete: 'CASCADE' });
TaskGroup.belongsTo(TaskBoard, { foreignKey: 'taskBoardId' });

TaskGroup.hasMany(Task, { foreignKey: 'taskGroupId', onDelete: 'CASCADE' });
Task.belongsTo(TaskGroup, { foreignKey: 'taskGroupId' });

User.hasMany(Event, { foreignKey: 'userId', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(DailyLog, { foreignKey: 'userId', as: 'dailyLogs' });
DailyLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ExternalCalendar, { foreignKey: 'userId', onDelete: 'CASCADE' });
ExternalCalendar.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ExternalCalendar.hasMany(Event, { foreignKey: 'externalCalendarId', onDelete: 'CASCADE' });
Event.belongsTo(ExternalCalendar, { foreignKey: 'externalCalendarId', as: 'externalCalendar' });

export { User, Task, TaskBoard, TaskGroup, Event, DailyLog, ExternalCalendar };
