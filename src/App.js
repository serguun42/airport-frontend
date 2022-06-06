import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <>
      <div id="app">
        <div id="content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
