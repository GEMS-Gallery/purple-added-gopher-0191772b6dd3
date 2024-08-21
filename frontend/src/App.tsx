import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { backend } from 'declarations/backend';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';

const Terminal = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#00FF00',
  fontFamily: '"VT323", monospace',
  padding: theme.spacing(2),
  minHeight: '100vh',
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

const CategoryCard = styled(Card)({
  backgroundColor: '#111',
  color: '#00FF00',
  border: '1px solid #00FF00',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#222',
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

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setCurrentView('topics');
    fetchTopics(category);
  };

  const handleTopicClick = (topicId: number) => {
    setCurrentTopic(topicId);
    setCurrentView('replies');
    fetchReplies(topicId);
  };

  const handleBack = () => {
    if (currentView === 'topics') {
      setCurrentView('categories');
      setCurrentCategory('');
    } else if (currentView === 'replies') {
      setCurrentView('topics');
      setCurrentTopic(null);
    }
  };

  const handleCreateTopic = async () => {
    if (input.trim() && currentCategory) {
      await backend.addTopic(currentCategory, input, 'New topic content');
      setInput('');
      await fetchTopics(currentCategory);
    }
  };

  const handleCreateReply = async () => {
    if (input.trim() && currentTopic !== null) {
      await backend.addReply(currentTopic, input);
      setInput('');
      await fetchReplies(currentTopic);
    }
  };

  return (
    <Terminal>
      <Typography variant="h4" gutterBottom>
        Hacker's Terminal
      </Typography>
      {currentView === 'categories' && (
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CategoryCard onClick={() => handleCategoryClick(category)}>
                <CardContent>
                  <Typography variant="h6">{category}</Typography>
                </CardContent>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      )}
      {currentView === 'topics' && (
        <>
          <Button onClick={handleBack}>Back</Button>
          <Typography variant="h5">Topics in {currentCategory}:</Typography>
          {topics.map((topic, index) => (
            <Typography key={index} className="topic" onClick={() => handleTopicClick(topic.id)}>
              {topic.id}: {topic.title}
            </Typography>
          ))}
          <Box mt={2}>
            <InputField
              fullWidth
              variant="standard"
              placeholder="Create new topic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleCreateTopic}>Create Topic</Button>
          </Box>
        </>
      )}
      {currentView === 'replies' && (
        <>
          <Button onClick={handleBack}>Back</Button>
          <Typography variant="h5">Replies:</Typography>
          {replies.map((reply, index) => (
            <Typography key={index} className="reply">{reply.content}</Typography>
          ))}
          <Box mt={2}>
            <InputField
              fullWidth
              variant="standard"
              placeholder="Add a reply"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleCreateReply}>Add Reply</Button>
          </Box>
        </>
      )}
    </Terminal>
  );
};

export default App;
