import { useEffect, useRef } from "react";
import "./Matrix.css";

type MatrixProps = {
  words: string[];
}

function Matrix({words}: MatrixProps) {
  const c = useRef<HTMLCanvasElement>(null);

  const startMatrix = () => {
    let interval: number;
    let resizeTimeout: number;

    if (c.current) {
      const ctx = c.current!.getContext("2d");
      c.current!.height = window.innerHeight;
      c.current!.width = window.innerWidth;
      const fontSize = 10;
      const columns = Math.floor(c.current!.width / fontSize);

      const drops: { wordIndex: number; letterIndex: number; screenIndex: number }[] = Array(columns).fill(null).map(() => ({
        wordIndex: Math.floor(Math.random() * words.length),
        letterIndex: 0,
        screenIndex: 0,
      }));

      const draw = () => {
        if (ctx) {
          // Slight transparent background to create a fading effect
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.fillRect(0, 0, c.current!.width, c.current!.height);

          // Set matrix character color and font size
          ctx.fillStyle = '#42f442';
          ctx.font = fontSize + "px Work Sans";

          // Draw each character in the matrix
          for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];
            const word = words[drop.wordIndex];
            const char = word[drop.letterIndex];

            ctx.fillText(char, i * fontSize, drop.screenIndex * fontSize);
            drop.letterIndex++;
            drop.screenIndex++;

            // Reset letterIndex and screenIndex for the drops
            if (drop.letterIndex >= word.length) {
              drop.letterIndex = 0;
              drop.wordIndex = Math.floor(Math.random() * words.length);
            }
            if (drop.screenIndex * fontSize > c.current!.height && Math.random() > 0.975) {
              drop.screenIndex = 0;
            }
          }
        }
      };

      interval = setInterval(draw, 35);

      const handleResize = () => {
        clearInterval(interval);
        ctx?.clearRect(0, 0, c.current!.width, c.current!.height);
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(startMatrix, 250); // Restart the matrix after resizing, debounced
      };

      // Attach the resize event listener
      window.addEventListener('resize', handleResize);

      // Clean up the interval and event listener on unmount
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(startMatrix, []);

  return <canvas ref={c}></canvas>;
}

export default Matrix;
