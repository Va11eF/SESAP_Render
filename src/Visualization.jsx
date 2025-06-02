import React from "react";
import styled from "@emotion/styled";

const ContentVisulization = styled.div`
    text-align: center; /* Center-align the text */
    margin: 0 auto; /* Center the content */
    max-width: 800px; /* Optional: limit the width for better readability */
    padding: 0px; /* Optional: add some padding around the content */
`;

const ContainerVisulization = styled.div`
    text-align: center; /* Center-align the text */
    margin: 0 auto; /* Center the content */
    max-width: 800px; /* Optional: limit the width for better readability */
    padding: 0px; /* Optional: add some padding around the content */
`;

const Paragraph = styled.p`
    margin-bottom: 10px;
    font-size: 16px; /* Explicitly set font size */
    text-align: left; /* Optional: Align text to the left */
    line-height: 1.5; /* Add spacing for better readability */
    font-style: italic; /* Make the text italic */
    
`;

const Header = styled.h1`
    color: #d73f09; /* Set the text color to orange */
`;

const Image = styled.img`
    max-width: 100%; /* Ensure the image fits within the container */
    height: auto; /* Maintain the aspect ratio */
    margin: 10px 0; /* Add some spacing around the image */
    background-color: white;
`;

export default function VisualizationPage() {
  return (
    <ContentVisulization>
      <ContainerVisulization>
        <Header>Thematic Trends Word Cloud</Header>
        <Image src="/wordcloud.png" alt="Thematic Trends Word Cloud" />
        <Paragraph>
          The word cloud represents the experiences of culture, identity, and power found in the student narratives. 
          These words are directly from the data set and represent the values and hardships of a diverse group of student engineers.
        </Paragraph>
      </ContainerVisulization>



      <ContainerVisulization>
        <Header>Thematic Coding Map</Header>
        <Image src="/barchart.png" alt="Thematic Coding Map" />
        <Paragraph>
          The thematic coding map depicts the interactions between identity, experience, and recommendations for change.
        </Paragraph>
      </ContainerVisulization>
    </ContentVisulization>
  );
}
