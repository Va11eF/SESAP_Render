import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from '@emotion/styled';

const Nav = styled.nav`
    background-color: rgb(33 37 41);
    padding-bottom: 10px;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-evenly;
    padding-top: 10px;
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
    margin: 0px;
    position: fixed;
    bottom: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 20px);
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
    margin-bottom: 100px;
`;

function Root() {
    const navigate = useNavigate();
    const [isGoogleReady, setIsGoogleReady] = useState(false);

    useEffect(() => {
        const loadGoogleScript = () => {
            if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                if (window.google && window.google.accounts) {
                    initializeGoogleSignIn();
                }
                return;
            }

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

        const initializeGoogleSignIn = () => {
            if (!window.google || !window.google.accounts) {
                console.error("Google API not loaded correctly");
                return;
            }

            try {
                window.google.accounts.id.initialize({
                    client_id: '493685022379-tiuah4qh7n2v2hqocvhec2k2p64ct9vp.apps.googleusercontent.com',
                    callback: handleGoogleSignIn,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    context: 'signin',
                    use_fedcm_for_prompt: true,
                    error_callback: (error) => {
                        console.error("Google Sign-In error:", error);
                    }
                });

                setIsGoogleReady(true);
                console.log("Google Sign-In initialized successfully");
            } catch (error) {
                console.error("Error initializing Google Sign-In:", error);
            }
        };

        loadGoogleScript();
    }, []);

    useEffect(() => {
        if (window.google && window.google.accounts && isGoogleReady && !isLoggedIn) {
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large', text: 'signin_with' }
            );
        }
    }, [isGoogleReady]);

    const handleGoogleSignIn = (response) => {
        const idToken = response.credential;
        console.log("Google Sign-In successful", response);
        localStorage.setItem('userToken', idToken);
        window.location.reload();
    };

    const handleLoginClick = () => {
        if (localStorage.getItem('userToken')) {
            localStorage.removeItem('userToken');
            window.location.reload();
            return;
        }

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

    const isLoggedIn = localStorage.getItem('userToken') !== null;

    return (
        <>
            <Wrapper>
                <Container>
                    <Heading>The EECS Student Experience Story Archive Project</Heading>
                    {!isLoggedIn ? (
                        <div id="google-signin-button" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}></div>
                    ) : (
                        <LoginButton onClick={handleLoginClick}>Logout</LoginButton>
                    )}
                </Container>
                <Nav>
                    <NavItem><NavLink to="/" className="nav-link">Visualization</NavLink></NavItem>
                    <NavItem><NavLink to="/narrative" className="nav-link">Narratives</NavLink></NavItem>
                    <NavItem><NavLink to="/purpose" className="nav-link">Purpose</NavLink></NavItem>
                    <NavItem><NavLink to="/recommendation" className="nav-link">Recommendations</NavLink></NavItem>
                </Nav>
            </Wrapper>
            <MainContent>
                <Outlet />
            </MainContent>
            <Footer>
                <FootTitle>The Archive Project</FootTitle>
                <div>
                    <FooterLink href="https://media.oregonstate.edu/tag?tagid=oh53" target="_blank" rel="noopener noreferrer">The Archive Site</FooterLink>
                    <FooterLink href="https://scarc.library.oregonstate.edu/oralhistory.html" target="_blank" rel="noopener noreferrer">SCARC OSU</FooterLink>
                </div>
            </Footer>
        </>
    );
}

export default Root;
