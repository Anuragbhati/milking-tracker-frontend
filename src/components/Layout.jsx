import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f6fa;
`;

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Footer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
  font-size: 0.9rem;

  p {
    margin: 0;
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
`;

function Layout() {
  return (
    <LayoutContainer>
      <Header>
        <h1>🐄 Dairy Milking Tracker</h1>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <Footer>
        <p>&copy; {new Date().getFullYear()} Dairy Milking Tracker. All rights reserved.</p>
      </Footer>
    </LayoutContainer>
  );
}

export default Layout;