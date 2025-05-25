import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
    text-align: center; /* Center-align the text */
    margin: 0 auto; /* Center the content */
    max-width: 800px; /* Optional: limit the width for better readability */
    padding: 0px; /* Optional: add some padding around the content */
`;

const ListItem = styled.li`
    margin-bottom: 10px; /* Add space between list items */
    list-style-position: inside; /* Make the list markers inside the content */
`;

const Header = styled.h1`
    color: #d73f09; /* Set the text color to orange */
`;

export default function RecommendationPage() {
    return (
        <Container>
            <Header>Our Recommendations</Header>
            <ul>
                <ListItem>A more extensive plan, spanning before arrival at OSU through graduation, for support of students access to educational opportunities along with career development and mentorship is needed, including relationships with others who have shared interests and can provide caring support for holistic information, resource, and community connection needs.</ListItem>
                <ListItem>Additional trainings should be conducted at all faculty and students levels to increase awareness of social justice, equity, and inclusion issues, including harms such as microaggressions, that are present in diverse communities and to increase capacity to listen, understand, and support diverse needs as well as appreciate the strengths and perspectives of diverse individuals.</ListItem>
                <ListItem>Diversity should be celebrated and valued as a part of the culture of the community, including opportunities to learn about and celebrate diverse perspectives and share ways of thinking about school, society, and engineering that are not included within the dominant tradition. Specific spaces, grassroots efforts, events, and resources should be devoted to this.</ListItem>
                <ListItem>More explicit emphasis on equity, inclusion, engineering for change social justice is needed in the EECS curriculum to better reflect and support students from underserved communities.</ListItem>
                <ListItem>Programs should be devoted to making connections between underserved communities and EECS programming and opportunities. These should include service learning, or engagement of students in community-centered projects that enable students to leverage concern for community well-being as well as faculty service research that bridges the gap between engineering research and underserved communities. The ability to engage in this research and service should be valued in processes for admissions and hiring.</ListItem>
                <ListItem>Specific efforts should be made to raise awareness about and to counter a culture of competitiveness, business, and prioritizing individual or program prestige above mutual support, caring, and collaboration. Cultural transformation efforts should include clear articulation of values and resources devoted to encouraging and rewarding positive practices in this area.</ListItem>
                <ListItem>Ongoing spaces and forums should be maintained for students from underserved communities to contribute to leadership of change efforts within EECS, including conveying their perspectives, concerns, and ideas for development to EECS leaders.</ListItem>
            </ul>
        </Container>
    );
}
