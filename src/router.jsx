import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App';
import styled from 'styled-components';
import MilkingHistory from './components/MilkingHistory';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
`;

const BackLink = styled.a`
  color: #3498db;
  text-decoration: none;
  margin-top: 20px;
  padding: 10px 20px;
  border: 2px solid #3498db;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

// Error boundary component for handling route errors
function ErrorBoundary() {
    return (
        <ErrorContainer>
            <h1>Oops! Something went wrong</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <BackLink href="/">Go back to home</BackLink>
        </ErrorContainer>
    );
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: 'history',
                element: <MilkingHistory />,
            },
        ],
    },
]);

export default router;