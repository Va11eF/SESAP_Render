import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 1000px;
  margin: auto;
  background-color: #2c3034;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  margin-top: 40px;
  margin-bottom: 40px;
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  background-color: #212529;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  iframe {
    width: 100%;
    height: 450px;
    border: none;
    border-radius: 4px;
  }
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0b5ed7;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  font-size: 2.5rem;
`;

const InfoSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #343a40;
  border-radius: 8px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoLabel = styled.strong`
  color: #adb5bd;
`;

const InfoText = styled.p`
  color: white;
  margin: 10px 0;
  line-height: 1.6;
`;

const ErrorContainer = styled.div`
  padding: 40px;
  background-color: #2c3034;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  margin: 40px auto;
  max-width: 600px;

  h2 {
    color: #dc3545;
    margin-bottom: 20px;
  }
`;

function InterviewVideo() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSources, setVideoSources] = useState([]);

  useEffect(() => {
    const fetchNarrative = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/narratives/${id}`);
        console.log("API Response:", response.data);
        
        // Check if the response has the expected structure
        if (response.data && !response.data.interviewEmbedLink && !response.data.embedLink) {
          console.warn("Warning: No video link found in the API response");
        }
        
        setNarrative(response.data);
      } catch (err) {
        console.error("Error fetching narrative:", err);
        setError("Failed to fetch narrative");
      } finally {
        setLoading(false);
      }
    };
  
    if (!location.state) {
      fetchNarrative();
    } else {
      console.log("Location state:", location.state);
      setNarrative(location.state);
      setLoading(false);
    }
  }, [id, location.state]);

  useEffect(() => {
    const processVideoSources = () => {
      if (!narrative) return [];
      
      // Debug log to see complete narrative data
      console.log("Full narrative data:", narrative);
    
      // Check for interviewEmbedLink (the one used by your API)
      if (narrative.interviewEmbedLink) {
        console.log("Found interviewEmbedLink:", narrative.interviewEmbedLink);
        return [convertToEmbedUrl(narrative.interviewEmbedLink)];
      }
    
      // The existing checks for backward compatibility
      // 1. Check for embedLinks array (new format)
      if (narrative.embedLinks?.length > 0) {
        console.log("Found embedLinks:", narrative.embedLinks);
        return narrative.embedLinks.map(convertToEmbedUrl);
      }
      
      // 2. Check for single embedLink (legacy format)
      if (narrative.embedLink) {
        console.log("Found single embedLink:", narrative.embedLink);
        return [convertToEmbedUrl(narrative.embedLink)];
      }
      
      // 3. Check for videoFiles (oldest format)
      if (narrative.videoFiles?.length > 0) {
        console.log("Found videoFiles:", narrative.videoFiles);
        return narrative.videoFiles.map(file => `/uploads/${file}`);
      }
      
      console.warn("No video sources found in narrative");
      return [];
    };
  
    const convertToEmbedUrl = (url) => {
      if (!url) return null;
      
      // YouTube URL conversions
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtube.com/embed')) {
        return url; // Already correct format
      }
      
      // Return other URLs as-is (Vimeo, etc.)
      return url;
    };
  
    const sources = processVideoSources().filter(url => {
      if (!url) {
        console.warn("Filtered out invalid URL:", url);
        return false;
      }
      return true;
    });
  
    console.log("Final video sources:", sources);
    setVideoSources(sources);
  }, [narrative]);

  if (loading) return <Container>Loading...</Container>;
  if (error) return (
    <ErrorContainer>
      <h2>Error: {error}</h2>
      <BackButton onClick={() => navigate(-1)}>Return to Narratives</BackButton>
    </ErrorContainer>
  );
  if (!narrative) return (
    <ErrorContainer>
      <h2>No Interview Found</h2>
      <BackButton onClick={() => navigate(-1)}>Return to Narratives</BackButton>
    </ErrorContainer>
  );

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Back to Narratives</BackButton>
      <Title>{narrative.intervieweeName}</Title>
      <InfoSection>
        <InfoText>
          <InfoLabel>Interviewer:</InfoLabel> {narrative.interviewerName}
        </InfoText>
        <InfoText>
          <InfoLabel>Date:</InfoLabel> {narrative.interviewDate}
        </InfoText>
        <InfoText>
          <InfoLabel>Description:</InfoLabel><br />
          {narrative.interviewDesc || narrative.description}
        </InfoText>
      </InfoSection>
      {videoSources.length > 0 ? (
        videoSources.map((src, index) => (
          <VideoWrapper key={index}>
            <iframe 
              src={src}
              title={`Video ${index + 1} - ${narrative.intervieweeName}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>
        ))
      ) : (
        <InfoText>No videos available for this interview.</InfoText>
      )}
    </Container>
  );
}

export default InterviewVideo;