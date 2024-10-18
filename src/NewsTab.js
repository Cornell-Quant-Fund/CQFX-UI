import React, { useEffect, useState } from 'react';

const NewsTab = ({ username, fetchNews, submitAnswer }) => {
  const [newsList, setNewsList] = useState([]);
  const [answerList, setAnswerList] = useState(Array(9).fill(null)); // Default empty strings for answers
  const [inputValues, setInputValues] = useState(Array(9).fill('')); // Temporary input values

  useEffect(() => {
    const fetchNewsData = async () => {
      const data = await fetchNews(username);
      setNewsList(data["news"]);
      setAnswerList(data["answers"] || Array(9).fill(null)); // Initialize with submitted answers or empty strings
      setInputValues(Array(9).fill('')); // Reset input values if needed
    };

    fetchNewsData();
    const intervalId = setInterval(fetchNewsData, 10000); // Fetch news every 10 seconds

    return () => clearInterval(intervalId);
  }, [fetchNews, username]);

  const totalAnswers = 9;

  // Handle submission of each answer
  const handleSubmitAnswer = async (index, e) => {
    e.preventDefault();
    const answer = inputValues[index]; // Use the input value, not the answerList value

    // Submit the answer to the backend
    await submitAnswer(username, index, parseInt(answer));

    // Update the answerList to reflect the submitted answer
    const newAnswerList = [...answerList];
    newAnswerList[index] = answer;
    setAnswerList(newAnswerList);

    // Clear the input value after submission
    const newInputValues = [...inputValues];
    newInputValues[index] = '';
    setInputValues(newInputValues);
  };

  // Generate an array of 9 placeholders (answer boxes or news)
  const renderBoxesOrNews = () => {
    console.log(answerList);
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
      } else {
        // Otherwise, display the answer box (if not submitted)
        boxes.push(
          <li key={i}>
            {answerList[i] === null ? ( // Check if the answer has not been submitted
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
            ) : (
              <p>Answer submitted: {answerList[i]}</p> // Show the submitted answer
            )}
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
