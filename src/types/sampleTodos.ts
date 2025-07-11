import { Todo } from "@/types/todo";

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "完成 Next.js Todo 作業",
    description: "研究規格並開始寫 code",
    dueDate: "2025-07-15",
    time: "09:00",
    completed: false,
    createdAt: "2025-07-07T09:00:00Z",
    updatedAt: "2025-07-07T09:00:00Z"
  },
  {
    id: "2",
    title: "閱讀 React 官方文件",
    description: "重點放在 hooks 部分",
    dueDate: "2025-07-09",
    time: "08:30",
    completed: true,
    createdAt: "2025-07-06T08:30:00Z",
    updatedAt: "2025-07-07T12:15:00Z"
  },
  {
    id: "3",
    title: "健身：腿部訓練",
    dueDate: "2025-07-08",
    time: "18:00",
    completed: false,
    createdAt: "2025-07-07T05:20:00Z",
    updatedAt: "2025-07-07T05:20:00Z"
  },
  {
    id: "4",
    title: "想一想週末去哪裡玩",
    description: "還沒決定日期，等朋友回覆",
    completed: false,
    createdAt: "2025-07-07T10:00:00Z",
    updatedAt: "2025-07-07T10:00:00Z"
  }
];
