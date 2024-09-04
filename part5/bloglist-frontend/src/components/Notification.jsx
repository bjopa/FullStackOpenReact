const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type.toString()}>{message}</div>;
};

export default Notification;
