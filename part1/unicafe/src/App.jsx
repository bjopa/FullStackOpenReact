import { useState } from "react";

const Header = ({ text }) => {
  return <h2>{text}</h2>;
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  console.log("g=", good);
  console.log("n=", neutral);
  console.log("b=", bad);
  console.log("t=", total);
  const avg = total > 0 ? ((good - bad) / total).toFixed(1) : 0;
  const positivePercentage = total > 0 ? ((good / total) * 100).toFixed(1) : 0;
  console.log(avg, positivePercentage);

  if (total === 0) return <div>No feedback given</div>;

  return (
    <table>
      <tbody>
        <StatisticsLine name="good" value={good} />
        <StatisticsLine name="neutral" value={neutral} />
        <StatisticsLine name="bad" value={bad} />
        <StatisticsLine name="all" value={total} />
        <StatisticsLine name="average" value={avg} />
        <StatisticsLine
          name="positive"
          value={positivePercentage}
          type="%"
        ></StatisticsLine>
      </tbody>
    </table>
  );
};

const StatisticsLine = (props) => {
  console.log(props);

  if (props.type != null)
    return (
      <tr>
        <td>{props.name}</td>
        <td>
          {props.value}
          {props.type}
        </td>
      </tr>
    );
    
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Button = (props) => {
  const { onClick, text } = props;
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClickGood = () => {
    const newGood = good + 1;
    setGood(newGood);
  };

  const handleClickNeutral = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);
  };

  const handleClickBad = () => {
    const newBad = bad + 1;
    setBad(newBad);
  };

  return (
    <>
      <Header text="give feedback" />
      <Button onClick={handleClickGood} text="good" />
      <Button onClick={handleClickNeutral} text="neutral" />
      <Button onClick={handleClickBad} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
