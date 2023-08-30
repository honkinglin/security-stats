import data from '../public/data.json';
import SecurityDate from './components/security-date.jsx';

function App() {

  return (
    <div className="container mx-auto">
      <div className="">
        <SecurityDate data={data} />
      </div>
    </div>
  )
}

export default App
