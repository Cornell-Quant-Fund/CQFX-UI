import React, { useEffect, useState } from 'react';

const NewsTab = ({ fetchNews }) => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNewsData = async () => {
      const news = await fetchNews();
      setNewsList(news);
    };

    fetchNewsData();
    const intervalId = setInterval(fetchNewsData, 10000); // Fetch news every 10 seconds

    return () => clearInterval(intervalId);
  }, [fetchNews]);

  if (newsList.length === 0) {
    return <p>Loading news...</p>;
  }

  return (
    <div className="news-tab">
      <h3>News</h3>
      <ul>
        {newsList.map((newsItem, index) => (
          <li key={index}>
            <p><strong>{newsItem.headline}</strong></p>
            <p>{new Date(newsItem.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsTab;
