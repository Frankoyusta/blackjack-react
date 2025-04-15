import { BrowserRouter as Router, Route } from 'react-router-dom';
import BlackjackOnlineApp from './BlackjackOnlineApp';

const App = () => {
  return (
    <Router>
        <Route path="/" component={BlackjackOnlineApp} />
    </Router>
  );
};

export default App;