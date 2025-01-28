// import { useEffect, useRef, useState } from 'react';
// import { Message } from '@/types/chat';
// import { Bot, User, Copy, Download, Play, Check, X, Maximize2, Minimize2 } from 'lucide-react';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-tsx';
// import 'prismjs/components/prism-bash';
// import 'prismjs/components/prism-json';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-css';

// interface ChatMessageProps {
//   message: Message;
// }

// interface CodeBlock {
//   language: string;
//   code: string;
// }

// const PREVIEWABLE_LANGUAGES = ['html', 'css', 'javascript', 'jsx'];

// export function ChatMessage({ message }: ChatMessageProps) {
//   const isBot = message.role === 'assistant';
//   const codeRef = useRef<HTMLPreElement>(null);
//   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//   const [previewIndex, setPreviewIndex] = useState<number | null>(null);
//   const [previewHeight, setPreviewHeight] = useState(300);
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     if (codeRef.current) {
//       Prism.highlightAllUnder(codeRef.current);
//     }
//   }, [message.content]);

//   const copyToClipboard = async (code: string, index: number) => {
//     await navigator.clipboard.writeText(code);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const downloadCode = (code: CodeBlock) => {
//     const blob = new Blob([code.code], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `code.${code.language}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const togglePreview = (index: number) => {
//     setPreviewIndex(previewIndex === index ? null : index);
//     setIsExpanded(false);
//   };

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//     setPreviewHeight(isExpanded ? 300 : 600);
//   };

//   const getPreviewContent = (codeBlock: CodeBlock) => {
//     switch (codeBlock.language) {
//       case 'html':
//         return codeBlock.code;
//       case 'css':
//         return `
//           <style>${codeBlock.code}</style>
//           <div class="preview-content">
//             <h1>CSS Preview</h1>
//             <p>This is a preview of your CSS styles.</p>
//             <button>Sample Button</button>
//             <div class="sample-box">Sample Box</div>
//           </div>
//         `;
//       case 'javascript':
//         return `
//           <div id="output"></div>
//           <script>
//             try {
//               const output = document.getElementById('output');
//               const log = console.log;
//               console.log = (...args) => {
//                 output.innerHTML += args.map(arg => 
//                   typeof arg === 'object' ? JSON.stringify(arg) : arg
//                 ).join(' ') + '<br>';
//               };
//               ${codeBlock.code}
//             } catch (error) {
//               document.getElementById('output').innerHTML = 
//                 '<span style="color: red">Error: ' + error.message + '</span>';
//             }
//           </script>
//         `;
//       case 'jsx':
//         return `
//           <div id="root"></div>
//           <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
//           <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//           <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
//           <script type="text/babel">
//             try {
//               ${codeBlock.code}
//               ReactDOM.render(
//                 React.createElement(App),
//                 document.getElementById('root')
//               );
//             } catch (error) {
//               document.getElementById('root').innerHTML = 
//                 '<span style="color: red">Error: ' + error.message + '</span>';
//             }
//           </script>
//         `;
//       default:
//         return '';
//     }
//   };

//   const parseContent = (content: string) => {
//     const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
//     const thoughts = thinkMatch ? thinkMatch[1].trim() : '';
//     const mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();

//     const parts = mainContent.split('```');
//     const formattedParts = parts.map((part, index) => {
//       if (index % 2 === 1) {
//         const [lang, ...codeLines] = part.split('\n');
//         const language = lang.trim();
//         const code = codeLines.join('\n').trim();
//         const codeBlock: CodeBlock = { language, code };
//         const isPreviewOpen = previewIndex === index;
//         const canPreview = PREVIEWABLE_LANGUAGES.includes(language);

//         return (
//           <div key={index} className="relative">
//             <div className="group">
//               <pre className="my-4 rounded-lg bg-[#1a1a1a] p-4 overflow-x-auto">
//                 <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button
//                     onClick={() => copyToClipboard(code, index)}
//                     className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                     title="Copy code"
//                   >
//                     {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
//                   </button>
//                   <button
//                     onClick={() => downloadCode(codeBlock)}
//                     className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                     title="Download code"
//                   >
//                     <Download size={16} />
//                   </button>
//                   {canPreview && (
//                     <button
//                       onClick={() => togglePreview(index)}
//                       className={`p-1.5 rounded ${
//                         isPreviewOpen 
//                           ? 'bg-blue-600 hover:bg-blue-700' 
//                           : 'bg-gray-700 hover:bg-gray-600'
//                       } text-white`}
//                       title={isPreviewOpen ? "Hide preview" : "Show preview"}
//                     >
//                       {isPreviewOpen ? <X size={16} /> : <Play size={16} />}
//                     </button>
//                   )}
//                 </div>
//                 <code className={`language-${language} text-sm`}>
//                   {code}
//                 </code>
//               </pre>
//             </div>
//             {canPreview && isPreviewOpen && (
//               <div className="mt-4 mb-8 rounded-lg border border-gray-200 bg-white overflow-hidden">
//                 <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-600">
//                     Preview ({language.toUpperCase()})
//                   </span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleExpand}
//                       className="p-1 hover:bg-gray-200 rounded"
//                       title={isExpanded ? "Minimize" : "Maximize"}
//                     >
//                       {isExpanded ? (
//                         <Minimize2 size={16} className="text-gray-600" />
//                       ) : (
//                         <Maximize2 size={16} className="text-gray-600" />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => togglePreview(index)}
//                       className="p-1 hover:bg-gray-200 rounded"
//                     >
//                       <X size={16} className="text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <iframe
//                     srcDoc={getPreviewContent(codeBlock)}
//                     className={`w-full border-0 transition-all duration-300 ease-in-out`}
//                     style={{ height: `${previewHeight}px` }}
//                     title={`${language} Preview`}
//                     sandbox="allow-scripts allow-popups"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }
//       return <p key={index} className="whitespace-pre-wrap">{part}</p>;
//     });

//     return { thoughts, formattedParts };
//   };

//   const { thoughts, formattedParts } = parseContent(message.content);

//   return (
//     <div className={`flex gap-4 p-4 ${isBot ? 'bg-gray-50' : ''}`}>
//       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
//         {isBot ? <Bot size={20} /> : <User size={20} />}
//       </div>
//       <div className="flex-1 max-w-full">
//         {thoughts && (
//           <div className="mb-4 border-l-2 border-blue-400 pl-4">
//             <h4 className="text-sm font-semibold text-blue-600 mb-2">Thought Process:</h4>
//             <div className="text-sm text-gray-600 whitespace-pre-wrap">{thoughts}</div>
//           </div>
//         )}
//         <div className="prose max-w-full" ref={codeRef}>
//           {formattedParts}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from 'react';
// import { Message } from '@/types/chat';
// import { Bot, User, Copy, Download, Play, Check, X, Maximize2, Minimize2 } from 'lucide-react';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-tsx';
// import 'prismjs/components/prism-bash';
// import 'prismjs/components/prism-json';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-css';

// interface ChatMessageProps {
//   message: Message;
// }

// interface CodeBlock {
//   language: string;
//   code: string;
// }

// const PREVIEWABLE_LANGUAGES = ['html', 'css', 'javascript', 'jsx'];

// export function ChatMessage({ message }: ChatMessageProps) {
//   const isBot = message.role === 'assistant';
//   const codeRef = useRef<HTMLPreElement>(null);
//   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//   const [previewIndex, setPreviewIndex] = useState<number | null>(null);
//   const [previewHeight, setPreviewHeight] = useState(300);
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     if (codeRef.current) {
//       Prism.highlightAllUnder(codeRef.current);
//     }
//   }, [message.content]);

//   const copyToClipboard = async (code: string, index: number) => {
//     await navigator.clipboard.writeText(code);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const downloadCode = (code: CodeBlock) => {
//     const blob = new Blob([code.code], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `code.${code.language}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const togglePreview = (index: number) => {
//     setPreviewIndex(previewIndex === index ? null : index);
//     setIsExpanded(false);
//   };

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//     setPreviewHeight(isExpanded ? 300 : 600);
//   };

//   const getPreviewContent = (codeBlock: CodeBlock) => {
//     switch (codeBlock.language) {
//       case 'html':
//         return codeBlock.code;
//       case 'css':
//         return `
//           <style>${codeBlock.code}</style>
//           <div class="preview-content">
//             <h1>CSS Preview</h1>
//             <p>This is a preview of your CSS styles.</p>
//             <button>Sample Button</button>
//             <div class="sample-box">Sample Box</div>
//           </div>
//         `;
//       case 'javascript':
//         return `
//           <div id="output"></div>
//           <script>
//             try {
//               const output = document.getElementById('output');
//               const log = console.log;
//               console.log = (...args) => {
//                 output.innerHTML += args.map(arg => 
//                   typeof arg === 'object' ? JSON.stringify(arg) : arg
//                 ).join(' ') + '<br>';
//               };
//               ${codeBlock.code}
//             } catch (error) {
//               document.getElementById('output').innerHTML = 
//                 '<span style="color: red">Error: ' + error.message + '</span>';
//             }
//           </script>
//         `;
//       case 'jsx':
//         return `
//           <div id="root"></div>
//           <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
//           <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//           <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
//           <script type="text/babel">
//             try {
//               ${codeBlock.code}
//               ReactDOM.render(
//                 React.createElement(App),
//                 document.getElementById('root')
//               );
//             } catch (error) {
//               document.getElementById('root').innerHTML = 
//                 '<span style="color: red">Error: ' + error.message + '</span>';
//             }
//           </script>
//         `;
//       default:
//         return '';
//     }
//   };

//   const parseContent = (content: string) => {
//     const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
//     const thoughts = thinkMatch ? thinkMatch[1].trim() : '';
//     const mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();

//     const parts = mainContent.split('```');
//     const formattedParts = parts.map((part, index) => {
//       if (index % 2 === 1) {
//         const [lang, ...codeLines] = part.split('\n');
//         const language = lang.trim();
//         const code = codeLines.join('\n').trim();
//         const codeBlock: CodeBlock = { language, code };
//         const isPreviewOpen = previewIndex === index;
//         const canPreview = PREVIEWABLE_LANGUAGES.includes(language);

//         return (
//           <div key={index} className="relative">
//             <div className="group">
//               <pre className="my-4 rounded-lg bg-[#1a1a1a] p-4 overflow-x-auto">
//                 <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button
//                     onClick={() => copyToClipboard(code, index)}
//                     className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                     title="Copy code"
//                   >
//                     {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
//                   </button>
//                   <button
//                     onClick={() => downloadCode(codeBlock)}
//                     className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
//                     title="Download code"
//                   >
//                     <Download size={16} />
//                   </button>
//                   {canPreview && (
//                     <button
//                       onClick={() => togglePreview(index)}
//                       className={`p-1.5 rounded ${
//                         isPreviewOpen 
//                           ? 'bg-blue-600 hover:bg-blue-700' 
//                           : 'bg-gray-700 hover:bg-gray-600'
//                       } text-white`}
//                       title={isPreviewOpen ? "Hide preview" : "Show preview"}
//                     >
//                       {isPreviewOpen ? <X size={16} /> : <Play size={16} />}
//                     </button>
//                   )}
//                 </div>
//                 <code className={`language-${language} text-sm`}>
//                   {code}
//                 </code>
//               </pre>
//             </div>
//             {canPreview && isPreviewOpen && (
//               <div className="mt-4 mb-8 rounded-lg border border-gray-200 bg-white overflow-hidden">
//                 <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-600">
//                     Preview ({language.toUpperCase()})
//                   </span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleExpand}
//                       className="p-1 hover:bg-gray-200 rounded"
//                       title={isExpanded ? "Minimize" : "Maximize"}
//                     >
//                       {isExpanded ? (
//                         <Minimize2 size={16} className="text-gray-600" />
//                       ) : (
//                         <Maximize2 size={16} className="text-gray-600" />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => togglePreview(index)}
//                       className="p-1 hover:bg-gray-200 rounded"
//                     >
//                       <X size={16} className="text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <iframe
//                     srcDoc={getPreviewContent(codeBlock)}
//                     className={`w-full border-0 transition-all duration-300 ease-in-out`}
//                     style={{ height: `${previewHeight}px` }}
//                     title={`${language} Preview`}
//                     sandbox="allow-scripts allow-popups"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       }
//       return <p key={index} className="whitespace-pre-wrap">{part}</p>;
//     });

//     return { thoughts, formattedParts };
//   };

//   const { thoughts, formattedParts } = parseContent(message.content);

//   return (
//     <div className={`flex gap-4 p-4 ${isBot ? 'bg-gray-50' : ''}`}>
//       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
//         {isBot ? <Bot size={20} /> : <User size={20} />}
//       </div>
//       <div className="flex-1 max-w-full">
//         {thoughts && (
//           <div className="mb-4 border-l-2 border-blue-400 pl-4">
//             <h4 className="text-sm font-semibold text-blue-600 mb-2">Thought Process:</h4>
//             <div className="text-sm text-gray-600 whitespace-pre-wrap">{thoughts}</div>
//           </div>
//         )}
//         <div className="prose max-w-full" ref={codeRef}>
//           {formattedParts}
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from 'react';
import { Message } from '@/types/chat';
import {
  Bot,
  User,
  Copy,
  Download,
  Play,
  Check,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

interface CodeBlock {
  language: string;
  code: string;
}

const PREVIEWABLE_LANGUAGES = ['html', 'css', 'javascript', 'jsx'];
const DEFAULT_PREVIEW_HEIGHT = 300;
const EXPANDED_PREVIEW_HEIGHT = 600;

const CodePreview = memo(
  ({
    codeBlock,
    previewHeight,
    isExpanded,
    onToggleExpand,
    onClosePreview,
  }: {
    codeBlock: CodeBlock;
    previewHeight: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onClosePreview: () => void;
  }) => {
    const getPreviewContent = useCallback((codeBlock: CodeBlock) => {
      switch (codeBlock.language) {
        case 'html':
          return codeBlock.code;
        case 'css':
          return `
            <style>${codeBlock.code}</style>
            <div class="preview-content">
              <h1>CSS Preview</h1>
              <p>This is a preview of your CSS styles.</p>
              <button>Sample Button</button>
              <div class="sample-box">Sample Box</div>
            </div>
          `;
        case 'javascript':
          return `
            <div id="output"></div>
            <script>
              try {
                const output = document.getElementById('output');
                const log = console.log;
                console.log = (...args) => {
                  output.innerHTML += args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : arg
                  ).join(' ') + '<br>';
                };
                ${codeBlock.code}
              } catch (error) {
                document.getElementById('output').innerHTML = 
                  '<span style="color: red">Error: ' + error.message + '</span>';
              }
            </script>
          `;
        case 'jsx':
          return `
            <div id="root"></div>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
            <script type="text/babel">
              try {
                ${codeBlock.code}
                ReactDOM.render(
                  React.createElement(App),
                  document.getElementById('root')
                );
              } catch (error) {
                document.getElementById('root').innerHTML = 
                  '<span style="color: red">Error: ' + error.message + '</span>';
              }
            </script>
          `;
        default:
          return '';
      }
    }, []);

    return (
      <div className="mt-4 mb-8 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Preview ({codeBlock.language.toUpperCase()})
          </span>
          <div className="flex gap-2">
            <button
              onClick={onToggleExpand}
              className="p-1 hover:bg-gray-200 rounded"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? (
                <Minimize2 size={16} className="text-gray-600" />
              ) : (
                <Maximize2 size={16} className="text-gray-600" />
              )}
            </button>
            <button
              onClick={onClosePreview}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <iframe
            srcDoc={getPreviewContent(codeBlock)}
            className={`w-full border-0 transition-all duration-300 ease-in-out`}
            style={{ height: `${previewHeight}px` }}
            title={`${codeBlock.language} Preview`}
            sandbox="allow-scripts allow-popups"
          />
        </div>
      </div>
    );
  }
);

const CodeBlockComponent = memo(
  ({
    codeBlock,
    index,
    onCopyToClipboard,
    onDownloadCode,
    onTogglePreview,
    isPreviewOpen,
    copiedIndex,
  }: {
    codeBlock: CodeBlock;
    index: number;
    onCopyToClipboard: (code: string, index: number) => void;
    onDownloadCode: (code: CodeBlock) => void;
    onTogglePreview: (index: number) => void;
    isPreviewOpen: boolean;
    copiedIndex: number | null;
  }) => {
    const codeRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
      if (codeRef.current) {
        Prism.highlightAllUnder(codeRef.current);
      }
    }, [codeBlock.code]);

    return (
      <div className="group">
        <pre className="my-4 rounded-lg bg-[#1a1a1a] p-4 overflow-x-auto" ref={codeRef}>
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCopyToClipboard(codeBlock.code, index)}
              className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
              title="Copy code"
            >
              {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={() => onDownloadCode(codeBlock)}
              className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
              title="Download code"
            >
              <Download size={16} />
            </button>
            {PREVIEWABLE_LANGUAGES.includes(codeBlock.language) && (
              <button
                onClick={() => onTogglePreview(index)}
                className={`p-1.5 rounded ${
                  isPreviewOpen
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
                title={isPreviewOpen ? 'Hide preview' : 'Show preview'}
              >
                {isPreviewOpen ? <X size={16} /> : <Play size={16} />}
              </button>
            )}
          </div>
          <code className={`language-${codeBlock.language} text-sm`}>
            {codeBlock.code}
          </code>
        </pre>
      </div>
    );
  }
);

const ThoughtProcess = memo(({ thoughts }: { thoughts: string }) => {
  return (
    <div className="mb-4 border-l-2 border-blue-400 pl-4">
      <h4 className="text-sm font-semibold text-blue-600 mb-2">
        Thought Process:
      </h4>
      <div className="text-sm text-gray-600 whitespace-pre-wrap">{thoughts}</div>
    </div>
  );
});

const MessageContent = memo(
  ({
    content,
    copiedIndex,
    onCopyToClipboard,
    onDownloadCode,
    previewIndex,
    onTogglePreview,
    previewHeight,
    isExpanded,
    onToggleExpand,
  }: {
    content: string;
    copiedIndex: number | null;
    onCopyToClipboard: (code: string, index: number) => void;
    onDownloadCode: (code: CodeBlock) => void;
    previewIndex: number | null;
    onTogglePreview: (index: number) => void;
    previewHeight: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
  }) => {
    const parseContent = useCallback((content: string) => {
      const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
      const thoughts = thinkMatch ? thinkMatch[1].trim() : '';
      const mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();

      const parts = mainContent.split('```');
      const formattedParts = parts.map((part, index) => {
        if (index % 2 === 1) {
          const [lang, ...codeLines] = part.split('\n');
          const language = lang.trim();
          const code = codeLines.join('\n').trim();
          const codeBlock: CodeBlock = { language, code };
          const isPreviewOpen = previewIndex === index;

          return (
            <div key={index} className="relative">
              <CodeBlockComponent
                codeBlock={codeBlock}
                index={index}
                onCopyToClipboard={onCopyToClipboard}
                onDownloadCode={onDownloadCode}
                onTogglePreview={onTogglePreview}
                isPreviewOpen={isPreviewOpen}
                copiedIndex={copiedIndex}
              />
              {PREVIEWABLE_LANGUAGES.includes(codeBlock.language) &&
                isPreviewOpen && (
                  <CodePreview
                    codeBlock={codeBlock}
                    previewHeight={previewHeight}
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                    onClosePreview={() => onTogglePreview(index)}
                  />
                )}
            </div>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {part}
          </p>
        );
      });

      return { thoughts, formattedParts };
    }, [
      copiedIndex,
      onCopyToClipboard,
      onDownloadCode,
      previewIndex,
      onTogglePreview,
      previewHeight,
      isExpanded,
      onToggleExpand,
    ]);

    const { thoughts, formattedParts } = parseContent(content);

    return (
      <div className="prose max-w-full">
        {thoughts && <ThoughtProcess thoughts={thoughts} />}
        {formattedParts}
      </div>
    );
  }
);

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewHeight, setPreviewHeight] = useState(DEFAULT_PREVIEW_HEIGHT);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = useCallback(async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const downloadCode = useCallback((code: CodeBlock) => {
    const blob = new Blob([code.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${code.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const togglePreview = useCallback((index: number) => {
    setPreviewIndex((prev) => (prev === index ? null : index));
    setIsExpanded(false);
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setPreviewHeight((prev) =>
      isExpanded ? DEFAULT_PREVIEW_HEIGHT : EXPANDED_PREVIEW_HEIGHT
    );
  }, [isExpanded]);

  return (
    <div className={cn(`flex gap-4 p-4 ${isBot ? 'bg-gray-50' : ''}`)}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1 max-w-full">
        <MessageContent
          content={message.content}
          copiedIndex={copiedIndex}
          onCopyToClipboard={copyToClipboard}
          onDownloadCode={downloadCode}
          previewIndex={previewIndex}
          onTogglePreview={togglePreview}
          previewHeight={previewHeight}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpand}
        />
      </div>
    </div>
  );
}