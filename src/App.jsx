import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from '@emotion/styled';

// Styled Components for layout and design
const Nav = styled.nav`
    background-color: rgb(33 37 41);
    padding: 10px 0;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-evenly;
    border-top: 1px solid grey;
    border-bottom: 1px solid grey;
`;

const NavItem = styled.div`
    margin: 0 15px;
`;

const Container = styled.div`
    position: relative;
    text-align: center;
    padding: 5px 0;
`;

const Heading = styled.h1`
    padding: 20px 0;
    color: #d73f09;
    margin: 0 auto;
`;

const LoginButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #d73f09;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
        background-color: #b33000;
    }
`;

const Wrapper = styled.div`
    background-color: rgb(24, 22, 22);
`;

const Footer = styled.footer`
    position: fixed;
    bottom: 0;
    width: calc(100% - 20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    background-color: rgb(24, 22, 22);
`;

const FootTitle = styled.h2`
    color: #d73f09;
`;

const FooterLink = styled.a`
    color: #d73f09;
    text-decoration: none;
    margin: 0 15px;
    &:hover {
        text-decoration: underline;
    }
`;

const MainContent = styled.div`
    margin-bottom: 100px; // To avoid overlap with fixed footer
`;

function Root() {
    const navigate = useNavigate(); // Hook for navigation
    const [isGoogleReady, setIsGoogleReady] = useState(false); // Track if Google Sign-In is ready

    // Load Google Sign-In script and initialize on mount
    useEffect(() => {
        const loadGoogleScript = () => {
            // Avoid loading script multiple times
            if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                if (window.google && window.google.accounts) {
                    initializeGoogleSignIn();
                }
                return;
            }

            // Create and append Google Sign-In script
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = initializeGoogleSignIn;
            script.onerror = () => {
                console.error("Failed to load Google Sign-In script");
            };
        };

        // Initialize Google Sign-In with config
        const initializeGoogleSignIn = () => {
            if (!window.google || !window.google.accounts) {
                console.error("Google API not loaded correctly");
                return;
            }

            try {
                window.google.accounts.id.initialize({
                    client_id: '530434203256-ebet6n08d0gei9avhnjmtcrarhgmc8a5.apps.googleusercontent.com',
                    callback: handleGoogleSignIn,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    context: 'signin',
                    use_fedcm_for_prompt: true,
                    error_callback: (error) => {
                        console.error("Google Sign-In error:", error);
                    }
                });

                setIsGoogleReady(true); // Set state once ready
                console.log("Google Sign-In initialized successfully");
            } catch (error) {
                console.error("Error initializing Google Sign-In:", error);
            }
        };

        loadGoogleScript();
    }, []);

    // Render the Google Sign-In button when ready and user is not logged in
    useEffect(() => {
        if (window.google && window.google.accounts && isGoogleReady && !isLoggedIn) {
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', text: 'signin_with' }
            );
        }
    }, [isGoogleReady]);

    // Handle Google sign-in response
    const handleGoogleSignIn = (response) => {
        const idToken = response.credential;
        console.log("Google Sign-In successful", response);

        // Save token in local storage and reload page
        localStorage.setItem('userToken', idToken);
        window.location.reload();
    };

    // Handle login/logout button click
    const handleLoginClick = () => {
        if (localStorage.getItem('userToken')) {
            // If already logged in, remove token and reload (logout)
            localStorage.removeItem('userToken');
            window.location.reload();
            return;
        }

        // Trigger Google Sign-In prompt
        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('Google Sign-In notification not displayed:', notification.getNotDisplayedReason());
                }
            });
        } else {
            console.error('Google API not loaded yet.');
        }
    };

    // Check if user is logged in based on localStorage
    const isLoggedIn = localStorage.getItem('userToken') !== null;

    return (
        <>
            <Wrapper>
                <Container>
                    <Heading>The EECS Student Experience Story Archive Project</Heading>

                    {/* Show login or logout button based on login state */}
                    {!isLoggedIn ? (
                        <div
                            id="google-signin-button"
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        ></div>
                    ) : (
                        <LoginButton onClick={handleLoginClick}>Logout</LoginButton>
                    )}
                </Container>

                {/* Navigation Bar */}
                <Nav>
                    <NavItem><NavLink to="/" className="nav-link">Visualization</NavLink></NavItem>
                    <NavItem><NavLink to="/narrative" className="nav-link">Narratives</NavLink></NavItem>
                    <NavItem><NavLink to="/purpose" className="nav-link">Purpose</NavLink></NavItem>
                    <NavItem><NavLink to="/recommendation" className="nav-link">Recommendations</NavLink></NavItem>
                </Nav>
            </Wrapper>

            {/* Render child routes */}
            <MainContent>
                <Outlet />
            </MainContent>

            {/* Footer with links */}
            <Footer>
                <FootTitle>The Archive Project</FootTitle>
                <div>
                    <FooterLink
                        href="https://media.oregonstate.edu/tag?tagid=oh53"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        The Archive Site
                    </FooterLink>
                    <FooterLink
                        href="https://scarc.library.oregonstate.edu/oralhistory.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        SCARC OSU
                    </FooterLink>
                </div>
            </Footer>
        </>
    );
}

export default Root;
