import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const onClickNext = () => {
    const newRandomSelected = getRandomIndex(anecdotes);
    setSelected(newRandomSelected);
  };

  const getRandomIndex = (anecdotes) => {
    return Math.floor(Math.random() * anecdotes.length);
  };

  const onClickVote = () => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    setVotes(votesCopy);
    console.log("Votes:", votesCopy);

    const maxIndex = getIndexOfMostVotes(votesCopy);
    setTopIndex(maxIndex);
  };

  const getIndexOfMostVotes = (votesArray) => {
    let maxIndex = 0;
    let maxValue = votesArray[0];

    for (let i = 1; i < votesArray.length; i++) {
      if (votesArray[i] > maxValue) {
        maxValue = votesArray[i];
        maxIndex = i;
      }
    }

    if ((maxIndex != topIndex) && (votesArray[maxIndex] > votesArray[topIndex]))
      return maxIndex;

    return topIndex;
  };

  return (
    //TODO Make separate components
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <div>has {votes[selected]} votes</div>
      <div>
        <button onClick={onClickVote}>vote</button>{" "}
        <button onClick={onClickNext}>next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      {anecdotes[topIndex]}
      <div>has {votes[topIndex]} votes</div>
    </div>
  );
};

export default App;
