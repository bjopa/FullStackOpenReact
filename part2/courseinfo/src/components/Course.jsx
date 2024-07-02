const Course = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
      return sum + part.exercises;
    }, 0);
  
    return (
      <div>
        <h2>{course.name}</h2>
        {course.parts.map((part) => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
        <div style={{fontWeight:"bold"}}>total of {total} exercises</div>
      </div>
    );
  };

  export default Course;