import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import { useEffect, useRef, useState } from 'react';
import "./Wordcloud.css";

type WordCloudProps = {
  words: {
    text: string;
    value: number;
  }[]
  error: string;
  handleClick: (text: string) => void;
  handleInput: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, value: string) => void;
}

function WordCloud({words, error, handleClick, handleInput,handleSubmit}: WordCloudProps) {

  const [size, setSize] = useState({ width: 100, height: 500 });
  const inputRef = useRef<HTMLInputElement>(null);
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

  return (
    <>
      <form className="word-add" onSubmit={(e) => {
        handleSubmit(e, inputRef.current!.value);
        inputRef.current!.value = '';
        inputRef.current!.focus();
      }}>
        <label htmlFor="word">Add a new word</label>
        <input
          type="text"
          id="word"
          ref={inputRef}
          aria-describedby={error ? "error-message" : undefined}
          aria-invalid={!!error}
          onInput={handleInput}
        />
        <button>Submit</button>
      </form>
      <div id="error-message" className="error" role="alert">{error || ''}</div>
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

export default WordCloud;