import data from '../public/data.json';
import githubLogo from './assets/github-mark.svg';
import SecurityDate from './components/security-date.jsx';

function App() {

  return (
    <div className="container mx-auto">
      <div className="">
        <SecurityDate data={data} />
      </div>

      <div className="fixed bottom-4 right-4 flex">
        <a href="https://github.com/honkinglin/security-stats" target="_blank">
          <img width={32} src={githubLogo} alt="github" />
        </a>
      </div>
    </div>
  )
}

export default App
