"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Label {
  id: number;
  name: string;
  color: string;
}

interface User {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface Issue {
  title: string;
  user: User;
  body: string;
  labels: Label[];
  state: string;
  html_url: string;
}

export default function Home() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false); // For showing full text
  const [countdown, setCountdown] = useState<number | null>(null); // For countdown
  const [parsedBody, setParsedBody] = useState<string | null>(null); // For parsed body

  async function fetchIssues() {
    try {
      const response = await fetch(
        "https://api.github.com/search/issues?q=is:issue%20repo:calcom/cal.com%20state:open"
      );

      if (!response.ok) {
        if (response.status === 403) {
          setError("Rate limit exceeded. Please wait.");
          startCountdown();
        } else {
          throw new Error(`Error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const randomIssue = data.items[Math.floor(Math.random() * data.items.length)];
        setIssue(randomIssue);
      } else {
        setError("No open issues found.");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    fetchIssues()
    if (issue && issue.body) {
      setParsedBody(issue.body);
    }
  }, [issue]);

  useEffect(() => {
    if (countdown === 0) {
      setError(null); // Hide the error after countdown ends
    }
  }, [countdown]);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const startCountdown = () => {
    let timeLeft = 60;
    setCountdown(timeLeft);
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
      } else {
        timeLeft--;
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center items-center font-sans">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Random Open GitHub Issue
        </h1>

        {error && (
          <div className="text-red-600 mb-4">
            <p>{error}</p>
            {countdown !== null && countdown > 0 && (
              <p>Please try again in {countdown}s</p>
            )}
          </div>
        )}

        {issue ? (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              className="text-2xl font-semibold text-gray-900 mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {issue.title}
            </motion.h2>

            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {issue.labels.map((label) => (
                <motion.span
                  key={label.id}
                  className="px-3 py-1 text-sm font-semibold rounded-full text-white"
                  style={{
                    backgroundColor: `#${label.color}`,
                    color: ['ffffff', '000000'].includes(label.color) ? 'black' : 'white',
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {label.name}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={issue.user.avatar_url}
                alt={issue.user.login}
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <a
                href={issue.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {issue.user.login}
              </a>
            </motion.div>

            <motion.div
  className="text-gray-700 mb-4 overflow-hidden max-h-40"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="prose max-w-none">
    {showFullText ? parsedBody! : parsedBody?.substring(0, 300) + '...'}
  </div>
  <button
    onClick={toggleText}
    className="mt-2 text-blue-600 hover:text-blue-800"
  >
    {showFullText ? "Show Less" : "Show More"}
  </button>
</motion.div>


            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <strong>State:</strong> {issue.state}
            </motion.p>

            <motion.a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-blue-600 hover:text-blue-800"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              View on GitHub
            </motion.a>
          </motion.div>
        ) : (
          !error && <p className="text-gray-600">Loading issue...</p>
        )}

        <div className="mt-6 text-center">
          <a
            href="https://github.com/calcom/cal.com/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View All Issues
          </a>
        </div>
      </div>
    </div>
  );
}
