// 用於未訂日期區的元件
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useDroppable, useDraggable } = require("@dnd-kit/core");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SortableContext, verticalListSortingStrategy } = require("@dnd-kit/sortable");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CSS } = require('@dnd-kit/utilities');

import { FC } from "react";

type UnscheduledTodosProps = {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
};

const UnscheduledTodos: FC<UnscheduledTodosProps> = ({ todos, onEdit, onToggle, onDelete, onAdd }) => {
  // dnd-kit droppable
  const { setNodeRef } = useDroppable({ id: 'unscheduled', data: { droppableId: 'unscheduled' } });

  return (
    <div
      ref={setNodeRef}
      className="bg-white dark:bg-gray-900 rounded-2xl pt-2 px-4 pb-4 min-h-[80px] mb-4 border border-gray-200 dark:border-gray-700 shadow-md transition-all flex flex-col justify-start unscheduled-todos-bg"
      style={{ position: 'relative', zIndex: 20, width: '300px', minWidth: '260px', maxWidth: '320px', flexShrink: 0, borderRadius: '1.25rem' }}
    >
      <div className="flex items-center justify-between mb-2 unscheduled-todos-title">
        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">未訂日期</span>
        {onAdd && (
          <button
            type="button"
            className="text-xs px-3 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none transition-colors"
            style={{ borderRadius: '0.75rem' }}
            onClick={onAdd}
          >
            ＋ 新增
          </button>
        )}
      </div>
      {todos.length === 0 && <div className="text-gray-400 dark:text-gray-500 text-sm unscheduled-todos-empty">暫無未訂日期待辦</div>}
      <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {todos.map(todo => (
            <UnscheduledTodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

// 子元件：每個未訂日期待辦的拖曳包裝，Hooks 必須在元件頂層
const UnscheduledTodoItem: FC<{
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ todo, onEdit, onToggle, onDelete }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useDraggable } = require("@dnd-kit/core");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CSS } = require('@dnd-kit/utilities');
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { droppableId: 'unscheduled' }
  });
  return (
    <div
      ref={setDraggableRef}
      style={{
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : undefined,
        position: isDragging ? 'relative' : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <TodoItem todo={todo} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
};

export default UnscheduledTodos;
