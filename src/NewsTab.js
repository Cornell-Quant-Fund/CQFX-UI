import React, { useEffect, useState } from 'react';

const NewsTab = ({ username, newsList, answerList, submitAnswer }) => {
  const [inputValues, setInputValues] = useState(Array(9).fill('')); // Temporary input values

  const totalAnswers = 9;

  // Handle submission of each answer
  const handleSubmitAnswer = async (index, e) => {
    e.preventDefault();
    const answer = inputValues[index]; // Use the input value

    // Submit the answer to the backend
    await submitAnswer(username, index, parseInt(answer));

    // Clear the input value after submission
    const newInputValues = [...inputValues];
    newInputValues[index] = '';
    setInputValues(newInputValues);
  };

  // Generate an array of 9 placeholders (answer boxes, news, or answers)
  const renderBoxesOrNews = () => {
    const boxes = [];
    for (let i = 0; i < totalAnswers; i++) {
      if (newsList && i < newsList.length) {
        // If there's a news item at this index, display the news
        const newsItem = newsList[i];
        boxes.push(
          <li key={i}>
            <p><strong>{newsItem}</strong></p>
          </li>
        );
      } else if (answerList && answerList[i] !== null) {
        // If there's an answer at this index, display the answer
        boxes.push(
          <li key={i}>
            <p>Answer submitted: {answerList[i]}</p>
          </li>
        );
      } else {
        // Otherwise, display the answer box
        boxes.push(
          <li key={i}>
            <div className="answer-box">
              <form onSubmit={(e) => handleSubmitAnswer(i, e)}>
                <label htmlFor={`answer${i + 1}`}>Answer {i + 1}:</label>
                <input
                  type="number"
                  id={`answer${i + 1}`}
                  name={`answer${i + 1}`}
                  value={inputValues[i]} // Use the local input value
                  onChange={(e) => {
                    const newInputValues = [...inputValues];
                    newInputValues[i] = e.target.value; // Update the local input value
                    setInputValues(newInputValues);
                  }}
                />
                <button type="submit" className="send-button">
                  Send
                </button>
              </form>
            </div>
          </li>
        );
      }
    }

    return boxes;
  };

  return (
    <div className="news-tab">
      <h3>News</h3>
      <ul>
        {renderBoxesOrNews()}
      </ul>
    </div>
  );
};

export default NewsTab;
