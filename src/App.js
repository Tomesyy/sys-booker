import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

function App() {
  const [code, setCode] = useState();

  return (
    <div className='code-editor-container'>
      <CodeEditor 
        value={code}
        language='js'
        placeholder='<Enter code here/>'
        onChange={(evn) => setCode(evn.target.value)}
        padding={16}
        style={{
          fontSize: '16px',
          fontWeight: '400px',
          lineHeight: '20px',
          backgroundColor: "#f7f7f7",
          border: '1px solid #000000',
          borderRadius: '8px',
          width: '100%',
          height: '100%',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <button className='code-editor-button'>Run</button>
    </div>
  );
}

export default App;
