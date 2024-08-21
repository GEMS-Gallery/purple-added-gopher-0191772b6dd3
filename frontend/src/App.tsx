import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { backend } from 'declarations/backend';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';

const Terminal = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#00FF00',
  fontFamily: '"VT323", monospace',
  padding: theme.spacing(2),
  height: '100vh',
  overflowY: 'auto',
}));

const PromptText = styled(Typography)({
  display: 'inline',
  marginRight: '8px',
});

const InputField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#00FF00',
    fontFamily: '"VT323", monospace',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#00FF00',
  },
});

const App: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [currentView, setCurrentView] = useState('categories');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentTopic, setCurrentTopic] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await backend.getCategories();
    setCategories(result);
  };

  const fetchTopics = async (category: string) => {
    const result = await backend.getTopics(category);
    setTopics(result);
  };

  const fetchReplies = async (topicId: number) => {
    const result = await backend.getReplies(topicId);
    setReplies(result);
  };

  const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      setInput('');

      if (currentView === 'categories') {
        const category = categories.find(c => c.toLowerCase() === command);
        if (category) {
          setCurrentCategory(category);
          setCurrentView('topics');
          await fetchTopics(category);
        }
      } else if (currentView === 'topics') {
        if (command === 'back') {
          setCurrentView('categories');
          setCurrentCategory('');
        } else if (command.startsWith('view ')) {
          const topicId = parseInt(command.split(' ')[1]);
          const topic = topics.find(t => t.id === topicId);
          if (topic) {
            setCurrentTopic(topicId);
            setCurrentView('replies');
            await fetchReplies(topicId);
          }
        } else if (command.startsWith('add ')) {
          const title = command.substring(4);
          await backend.addTopic(currentCategory, title, 'New topic content');
          await fetchTopics(currentCategory);
        }
      } else if (currentView === 'replies') {
        if (command === 'back') {
          setCurrentView('topics');
          setCurrentTopic(null);
        } else if (command.startsWith('reply ')) {
          const content = command.substring(6);
          if (currentTopic !== null) {
            await backend.addReply(currentTopic, content);
            await fetchReplies(currentTopic);
          }
        }
      }
    }
  };

  return (
    <Terminal>
      <Typography variant="h4" gutterBottom>
        Hacker's Terminal
      </Typography>
      {currentView === 'categories' && (
        <>
          <Typography>Available categories:</Typography>
          {categories.map((category, index) => (
            <Typography key={index} className="category">{category}</Typography>
          ))}
        </>
      )}
      {currentView === 'topics' && (
        <>
          <Typography>Topics in {currentCategory}:</Typography>
          {topics.map((topic, index) => (
            <Typography key={index} className="topic">{topic.id}: {topic.title}</Typography>
          ))}
          <Typography>Commands: 'back', 'view [id]', 'add [title]'</Typography>
        </>
      )}
      {currentView === 'replies' && (
        <>
          <Typography>Replies:</Typography>
          {replies.map((reply, index) => (
            <Typography key={index} className="reply">{reply.content}</Typography>
          ))}
          <Typography>Commands: 'back', 'reply [content]'</Typography>
        </>
      )}
      <Box display="flex" alignItems="center" mt={2}>
        <PromptText>$</PromptText>
        <InputField
          fullWidth
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleInput}
        />
      </Box>
    </Terminal>
  );
};

export default App;
