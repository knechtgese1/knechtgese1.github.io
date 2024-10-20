import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import { useEffect, useRef, useState } from 'react';
import { Upvote, Word } from '../types/types';
import "./Wordcloud.css";

type WordCloudProps = {
  currentUser: number;
  error: string;
  upvotes: Upvote[];
  words: Word[];
  handleClick: (text: string) => void;
  handleInput: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, value: string) => void;
}

function WordCloud({currentUser, error, upvotes, words, handleClick, handleInput,handleSubmit}: WordCloudProps) {

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

  const isUpvoted = (wordId: number) => upvotes.some(upvote => upvote.wordId === wordId && upvote.userId === currentUser);

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
            cloudWords.map((w) => {
              const wordExtended = w as typeof w & { user: number, id: number };
              return (
                <Text
                  key={w.text}
                  className={isUpvoted(wordExtended.id) ? 'upvote' : ''}
                  fill={wordExtended.user === currentUser ? 'var(--c-blue)' : 'var(--c-lightblue)'}
                  textAnchor={'middle'}
                  transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                  onClick={() => handleClick(w.text!)}
                >
                  {wordExtended.text + (isUpvoted(wordExtended.id) ? ' 👍' : '')}
                </Text>
              )
            })
          }
        </Wordcloud>
      </div>
    </>
  )
}

export default WordCloud;