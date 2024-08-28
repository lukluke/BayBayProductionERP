type Task = {
  state: string;
  id: string;
  title: string;
  deadline: Date | null;
  assigneeUser: {
    username: string;
  } | null;
};

type TaskDetail = {
  id: string;
  state: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  createdAt: Date;
  assigneeUser: {
    username: string;
  } | null;
  assignerUser: {
    username: string;
  } | null;
};
