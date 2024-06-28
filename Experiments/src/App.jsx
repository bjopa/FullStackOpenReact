import { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);
  console.log("rendering with counter value", counter);

  const increaseByOne = () => {
    console.log("increasing, value before", counter);
    setCounter(counter + 1);
  };

  const decreaseByOne = () => {
    console.log("decreasing, value before", counter);
    setCounter(counter - 1);
  };

  const setToZero = () => {
    console.log("resetting to zero, value before", counter);
    setCounter(0);
  };

  const Display = ({ counter }) => <div>{counter}</div>;

  const Button = ({ onSmash, text }) => <button onClick={onSmash}>{text}</button>

  return (
    <div>
      <Display counter={counter} />

      <Button onSmash={increaseByOne} text="Plus" />

      <Button onSmash={setToZero} text="Zero" />

      <Button onSmash={decreaseByOne} text="Minus" />
    </div>
  );
};
export default App;
