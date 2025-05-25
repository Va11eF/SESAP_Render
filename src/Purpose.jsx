import React from "react";
import styled from '@emotion/styled';

const Header = styled.h1`
    color: #d73f09; /* Set the text color to orange */
    font-size: 24px; /* Explicitly set font size */
`;

const Paragraph = styled.p` /* Use <p> for paragraphs, not <li> */
    margin-bottom: 10px;
    font-size: 16px; /* Explicitly set font size */
    text-align: left; /* Optional: Align text to the left */
    line-height: 1.5; /* Add spacing for better readability */
    text-indent: 40px;
`;

const PurposeContainer = styled.div` /* Use <div> instead of <h1> */
    text-align: center;
    margin: 0 auto;
    max-width: 800px;
    padding: 0px;
`;

function PurposePage() {
  return (
    <PurposeContainer>
      <Header>
        ABOUT
      </Header>
      <Paragraph>
        The EECS Student Experience Story Archive Project (SESAP) is a forum created to raise awareness 
        for engineering education and industry leaders about what is needed to best support the success and empowerment of 
        EECS students from historically underserved communities based on race, ethnicity, religion, nationality, first-generation 
        status, gender identity, sexual orientation and/or disability. In this special archive, students who identify themselves 
        as members of one or more of these communities offer their narrative testimonies and unique insights to illuminate opportunities 
        for program and institutional transformation to incorporate the agency of more diverse perspectives and advocate for diversity, 
        equity, inclusion, and social justice in engineering education and the engineering profession.
      </Paragraph>

      <Header>
        THE PEOPLE
      </Header>

      <Paragraph>
        The narratives included in this archive are auto-ethnographic testimonios. The term auto-ethnography designates the agency exercised
        by each of the participants appearing in the archive as the authors of their own stories that center on their experiences of culture, 
        identity, and power. The term testimonio further designates the type of narratives offered here as accounts that bear witness and testify
        about events, including injustices, that have powerfully impacted the lives of individuals and communities. We believe these accounts have
        important implications not only for the School of EECS at Oregon State University but also for institutions of engineering education and 
        for the discipline of engineering more broadly. Each of the recordings appearing in the archive is approximately 20-30 minutes in length 
        and was created using Zoom. The individual authors tell their own stories and make selections about most important aspects to include about 
        their experiences based on a basic framework of guiding prompts focusing on: their identity; influential community and cultural background 
        leading up to their educational experiences; accounts of the intersection of identity, community, culture, power, and their experience in 
        engineering education programs; strengths they bring to these programs as individuals and members of their communities, and recommendations 
        for future changes or actions in support of students from underserved communities. After a brief introduction from the SESAP project organizer,
        each of the individual authors primarily appears speaking on their own for the duration of the recording.
      </Paragraph>

      <Header>
        OUR GOAL
      </Header>

      <Paragraph>
        On behalf of the EECS SESAP program organizers and all of its co-authors, we hope that you will view this archive as a tool to better understand
        the experiences of engineering students from historically underserved communities, that you will appreciate the agency of each of the individual
        authors included to voice significant aspects of their own stories, and that you will consider how you can also support them and others by leveraging
        new understanding gained in actions to pursue positive change in engineering education.
      </Paragraph>
    </PurposeContainer>


  );
}

export default PurposePage;