import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import './App.css'
import { useEffect, useRef, useState } from 'react';
import Matrix from './Matrix';

function App() {

  const fakeWords = [
    {
      text: 'Sample',
      value: 500,
    },
    {
      text: 'Word',
      value: 300,
    },
    {
      text: 'Cloud',
      value: 250,
    },
    {
      text: 'transmogrification',
      value: 1000,
    }
  ];

  const [size, setSize] = useState({ width: 100, height: 500 });
  const [words, setWords] = useState(fakeWords);
  const cloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (cloudRef.current) {
        const rect = cloudRef.current.getBoundingClientRect();
        setSize({
          width: rect.width,
          height: 500,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleClick = (text: string) => {
    console.log('clicked', text);
    setWords(fakeWords.filter(word => word.text.length > 4));
  }

  return (
    <>
      <h1>WordCloud</h1>
      <Matrix />
      <div id="wordcloud" ref={cloudRef}>
        <Wordcloud
          width={size.width}
          height={size.height}
          words={words}
          font="Work Sans"
          rotate={0}
        >
          {(cloudWords) =>
            cloudWords.map((w) => (
              <Text
                key={w.text}
                fill={'lightblue'}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
                onClick={() => handleClick(w.text!)}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      </div>
    </>
  )
}

export default App
