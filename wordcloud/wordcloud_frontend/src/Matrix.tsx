import { useEffect, useRef } from "react";

function Matrix() {

  const c = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (c.current) {
      const ctx = c.current!.getContext("2d");
      c.current!.height = window.innerHeight;
      c.current!.width = window.innerWidth;


      const matrixString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
      const matrix = matrixString.split('');
      const fontSize = 10;
      const columns = c.current.width / fontSize;
      const drops: number[] = Array(Math.floor(columns)).fill(1); // Initialize all drops to 1

      // Drawing function
      const draw = () => {
        if (ctx) {
          // Slight transparent background to create trailing effect
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.fillRect(0, 0, c.current!.width, c.current!.height);

          // Set matrix character color and font size
          ctx.fillStyle = '#42f442';
          ctx.font = fontSize + "px Work Sans";

          // Draw each character in the column
          for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            // If drop is out of screen, randomly reset it
            if (drops[i] * fontSize > c.current!.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }
      };

      // Set one interval for the animation
      const interval = setInterval(draw, 35);

      // Cleanup the interval on unmount
      return () => clearInterval(interval);
    }
  }, [])

  return (
    <canvas ref={c}></canvas>
  )
};

export default Matrix;