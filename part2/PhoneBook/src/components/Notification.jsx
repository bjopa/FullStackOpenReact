const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="notealert">
        {message}
      </div>
    )
  }
  
  export default Notification