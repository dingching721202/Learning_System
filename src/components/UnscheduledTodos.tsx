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
      className="bg-white dark:bg-gray-900 rounded-xl pt-2 px-4 pb-4 min-h-[80px] mb-4 border border-gray-200 shadow-md transition-all flex flex-col justify-start unscheduled-todos-bg"
      style={{ position: 'relative', zIndex: 20, width: '300px', minWidth: '260px', maxWidth: '320px', flexShrink: 0 }}
    >
      <div className="flex items-center justify-between mb-2 unscheduled-todos-title">
        <span className="font-normal text-gray-500">未訂日期</span>
        {onAdd && (
          <button
            type="button"
            className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            onClick={onAdd}
          >
            ＋ 新增
          </button>
        )}
      </div>
      {todos.length === 0 && <div className="text-gray-400 text-sm unscheduled-todos-empty">暫無未訂日期待辦</div>}
      <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {todos.map(todo => (
          <UnscheduledTodoItem
            key={todo.id}
            todo={todo}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
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
