import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import './App.css'
import { useState } from 'react';

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

  const [words, setWords] = useState(fakeWords);

  const handleClick = (text: string) => {
    console.log('clicked', text);
    setWords(fakeWords.filter(word => word.text.length > 4));
  }

  return (
    <>
      <h1>WordCloud</h1>
      <div id="wordcloud">
        <Wordcloud
          width={400}
          height={400}
          words={words}
          font="Work Sans"
          rotate={0}
        >
          {(cloudWords) =>
            cloudWords.map((w) => (
              <Text
                key={w.text}
                fill={'lightgreen'}
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
