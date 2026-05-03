import type { TaskBoard } from '../../models/TaskBoard';

interface BoardItemProps {
    board: TaskBoard;
    onClick?: (board: TaskBoard) => void;
}

export default function BoardItem({ board, onClick }: BoardItemProps) {
    let totalTasks = 0;
    let completedTasks = 0;

    if (board.TaskGroups) {
        board.TaskGroups.forEach(group => {
            if (group.Tasks) {
                totalTasks += group.Tasks.length;
                completedTasks += group.Tasks.filter(task => task.status === 'completed').length;
            }
        });
    }

    return (
        <div 
            className="w-full h-24 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group flex flex-col justify-between"
            onClick={() => onClick && onClick(board)}
        >
            <div className="w-full">
                <p className="text-md text-white font-bold mb-1 line-clamp-1 h-6 leading-6 overflow-hidden text-ellipsis" title={board.title}>
                    {board.title}
                </p>
                <p className="text-gray-400 text-sm">
                    {`${completedTasks}/${totalTasks}`}
                </p>
            </div>
        </div>
    );
}
