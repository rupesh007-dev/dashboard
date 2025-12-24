import { useEffect, useState } from 'react';

const RandomQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const apiKey = 'g4kIvpBbHGVxf9XHKO7tug==TXbMTbKvuuNe42v7';

      const res = await fetch('https://api.api-ninjas.com/v2/quoteoftheday', {
        headers: { 'X-Api-Key': apiKey },
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      if (data && data.length > 0) {
        const newQuote = {
          text: data[0].quote,
          author: data[0].author,
          timestamp: Date.now(),
        };
        localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
        setQuote(newQuote.text);
        setAuthor(newQuote.author);
      }
    } catch (err) {
      console.error('Quote fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedQuote = localStorage.getItem('dailyQuote');
    if (storedQuote) {
      const parsed = JSON.parse(storedQuote);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (now - parsed.timestamp < oneDay) {
        setQuote(parsed.text);
        setAuthor(parsed.author);
        setLoading(false);
        return;
      }
    }
    fetchQuote();
  }, []);

  if (error) return null;

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Quote of the day</p>
      {loading ? (
        <div className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      ) : (
        <div className="space-y-2">
          <p className="text-xl font-medium text-gray-800 dark:text-gray-100">“{quote}”</p>
          <p className="text-sm italic text-gray-500">— {author}</p>
        </div>
      )}
    </div>
  );
};

export default RandomQuote;
