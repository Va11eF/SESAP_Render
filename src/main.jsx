import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './App';  // Import Root component
import VisualizationPage from './Visualization';
import RecommendationPage from './recommendation';
import PurposePage from './Purpose';
import NarrativePage from './Narratives';
import InterviewVideo from './InterviewVideo';
import ErrorPage from './Error';

// Font Awesome source used for icons: https://fontawesome.com/
// Font Source: https://fonts.google.com/specimen/Ubuntu
const globalStyles = css`
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    html {
        font-family: "Fredoka", sans-serif;
    }

    body {
        padding: 0px;
        margin: 0px;
        background-color: #212529; 
        color: white;
        text-align: center;
    }

    .nav-link {
        color: white; /* White text */
        text-decoration: none; /* Remove underline */
        font-size: 18px; /* Make the text a bit bigger */
    }
`;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Root><ErrorPage/></Root>,
        children: [
            {
                path: "/",  
                element: <VisualizationPage/>
            },
            {
                path: "/recommendation",
                element: <RecommendationPage/>
            },
            {
                path: "/purpose",
                element: <PurposePage/>
            },
            {
                path: "/narrative",
                element: <NarrativePage/>
            },
            {
                path: "/interview-video/:id", 
                element: <InterviewVideo/>
            }
        ]
    }
]);

// Source used to fix double rendering with StrictMode: 
// https://support.boldreports.com/kb/article/12888/how-to-prevent-methods-from-being-called-twice-in-react#:~:text=To%20fix%20this%20issue%2C%20you,methods%20from%20being%20called%20twice.
ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Global styles={globalStyles}/>
        <RouterProvider router={router}/>
    </>
);