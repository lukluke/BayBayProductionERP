type Booking = {
  id: string;
  venue: string;
  date: Date;
  time: Date;
  approved: boolean;
  createdAt: Date;
  users: {
    username: string;
  };
};
