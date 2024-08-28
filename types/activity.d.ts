type Activity = {
  approved: boolean;
  createdAt: Date;
  date: string;
  id: string;
  title: string;
  start: Date;
  end: Date;
  creator: {
    username: string;
  };
};
