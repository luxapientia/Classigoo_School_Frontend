import React, { useState, useEffect, useRef } from "react";

const WritingCanvas = ({ color, text }) => {
  const canvasRef = useRef(null);
  let ctx;
  let isDrawing = false;
  const [currentPath, setCurrentPath] = useState([]);

  const handleMouseDown = (event) => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(
        event.clientX - canvasRef.current.offsetLeft,
        event.clientY - canvasRef.current.offsetTop
      );
      isDrawing = true;
    }
  };
  const handleMouseMove = (event) => {
    if (isDrawing === false) return;
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentPath((s = []) => [...(s ?? []), { x, y }]);
  };
  const handleMouseUp = () => {
    if (ctx) {
      isDrawing = false;
      setCurrentPath([]);
    }
  };
  const touchStart = (event) => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(
        event.touches[0].clientX - canvasRef.current.offsetLeft,
        event.touches[0].clientY - canvasRef.current.offsetTop
      );
      isDrawing = true;
    }
  };
  const touchMove = (event) => {
    if (isDrawing === false) return;
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    setCurrentPath((s = []) => [...(s ?? []), { x, y }]);
  };
  const touchEnd = () => {
    if (ctx) {
      isDrawing = false;
      setCurrentPath([]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "100px Arial";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.strokeText(text, centerX, centerY);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", touchStart);
    canvas.addEventListener("touchmove", touchMove);
    canvas.addEventListener("touchend", touchEnd);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", touchStart);
      canvas.removeEventListener("touchmove", touchMove);
      canvas.removeEventListener("touchend", touchEnd);
    };
  }, [text]);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.beginPath();
    currentPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  }, [currentPath, color]);

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid lightgrey",
        cursor: "crosshair",
        width: 400,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        style={{ display: "block" }}
      />
    </div>
  );
};
export default WritingCanvas;
