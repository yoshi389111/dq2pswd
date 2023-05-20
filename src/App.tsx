import React, { useState } from 'react';
import './App.css';
import Dq2Edit from './Dq2Edit'
import Dq2Analize from './Dq2Analize'

type ModeType = 'edit' | 'analize';

const scrollTop = () => window.scrollTo(0, 0);

const App: React.FC = () => {
  const [page, setPage ] = useState<ModeType>('edit');
  const [password, setPassword ] = useState<string>('');

  const movePage = (page: ModeType) => {
    setPage(page);
    scrollTop();
  }

  return (
    <div className="App">
      <div className="header">
        <h1>ふっかつのじゅもん２</h1>
      </div>

      { page === 'edit' &&
        <Dq2Edit
          password={password}
          setPassword={setPassword}
          moveAnalize={() => movePage('analize')}
        />
      }
      { page === 'analize' &&
        <Dq2Analize
          password={password}
          setPassword={setPassword}
          moveEdit={() => movePage('edit')}
        />
      }
    </div>
  );
}

export default App;
