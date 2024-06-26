import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import * as espree from 'espree';
import CodeEditor from '@uiw/react-textarea-code-editor';

const SPECIAL = "zA$2B_9C";

function extractIdentifier(code){
  try {
    const ast = espree.parse(code, { ecmaVersion: 2020 });

    const statement = ast.body[0];

    // Handle common statement types
    switch (statement.type) {
      case 'VariableDeclaration':
        return statement.declarations[0].id.name;
      case 'FunctionDeclaration':
        return statement.id.name;
      case 'ExpressionStatement':
        if (statement.expression.type === 'AssignmentExpression') {
          return statement.expression.left.name || statement.expression.left.property.name;
        }
        break;
      case 'ClassDeclaration':
        return statement.id.name;
      default:
        console.warn(`Unsupported statement type for identifier extraction: ${statement.type}`);
    }

    return null;
  } catch (error) {
    console.error("Error parsing code:", error);
    return null;
  }
}

function runScript(code) {
  const script = document.createElement('script');

  script.textContent = `
    ${SPECIAL} = ${code}
  `;

  document.head.appendChild(script);
}

function Output(props) {
  return (
    <div className="output-container">
      {props.data}
    </div>
  );
}

function NavBar() {

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <div className='logo-container'>
          <img src='booklogo.png'  alt='Book Logo' className='book-logo'/>
          <span className='project-name'>SYS-Booker</span>
        </div>
        <div className="workspace-container">
          <img src='profile-pic.jpeg' alt="Profile Picture" className="profile-picture" />
          <span className="workspace-name">Dr. Folorunso's Workspace</span>
        </div>
      </div>
      <div className='navbar-right'>
        <button className='new-project-button'>
          <div className="button-content">
            <img className='plus-icon' src='plus.svg' alt='plus-icon'/>
            New Project
          </div>
        </button>
      </div>
    </nav>
  );
}

function Cell(props) {
  const [code, setCode] = useState();
  const [output, setOutput] = useState();
  const [showOutput, setShowOutput] = useState(false);

  function executeCode(code){
    try {
      if(code.trim().length > 0){
        let codeIdentifier = extractIdentifier(code);
        runScript(code);
        const codeOutput = codeIdentifier ? codeIdentifier + " = " + window[SPECIAL] || "undefined" : window[SPECIAL] || "undefined";
        setOutput(codeOutput);
        setShowOutput(true);
      } else {
        setOutput('');
        setShowOutput(false);
      }
    } catch(error) {
      console.log("Error", error);
    }
  }

  return (
    <div className='cell-container'>
        {showOutput && <Output data={output}/>}
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
          <button className='ai-button'>
            <img className='ai-logo' src='bulb.svg' alt='ai-logo'/>
          </button>
          <button className='run-button' onClick={() => executeCode(code)}>
            <img className='run-logo' src='player-play.svg' alt='run-logo'/>
          </button>
        </div>
      </div>
  );
}

function App() {
  const [cells, setCells] = useState([1]);
  let count = 2;

  function createNewCell() {
    setCells([...cells, count++]);
  }

  return (
    <>
      <NavBar />
      <div className='page-container'>
        {cells.map((currCell, idx) => (
          <Cell key={"cell-"+idx} />
        ))}
        <button className='add-new-cell-button' onClick={() => createNewCell()}>
          <img className='plus-icon' src='white-plus.svg' alt='plus-icon'/>
        </button>
      </div>
      
    </>
  );
}

export default App;
