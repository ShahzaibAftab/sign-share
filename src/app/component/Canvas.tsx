"use client"
import { useRef, useState, useEffect } from 'react';

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [fontWeight, setFontWeight] = useState<string>('normal');
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        }
    }, []);

    const handleBackgroundColorChange = (color: string) => {
        setBackgroundColor(color);
    };

    const handleFontWeightChange = (weight: string) => {
        setFontWeight(weight);
    };

    const handleSaveAsPNG = () => {
        if (!canvasRef.current) return;

        const url = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas.png';
        link.click();
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(
            event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetX : event.nativeEvent.touches[0].clientX,
            event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetY : event.nativeEvent.touches[0].clientY
        );
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(
            event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetX : event.nativeEvent.touches[0].clientX,
            event.nativeEvent instanceof MouseEvent ? event.nativeEvent.offsetY : event.nativeEvent.touches[0].clientY
        );
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleClearScreen = () => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        setBackgroundColor('#ffffff');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="mb-4 flex items-center justify-center">
                <div className='flex'>
                    <label htmlFor="backgroundColor">Background Color:</label>
                    <input
                        id="backgroundColor"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    />
                </div>
                <div className='mx-4'>
                    <label htmlFor="fontWeight">Font Weight:</label>
                    <select
                        id="fontWeight"
                        value={fontWeight}
                        onChange={(e) => handleFontWeightChange(e.target.value)}
                    >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                    </select>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight * 0.6}
                className={`mx-2 border-gray-800 text-white font-${fontWeight}`}
                style={{ backgroundColor: backgroundColor }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className="flex justify-between">
                <button onClick={handleClearScreen} className="bg-red-600 px-3 py-1 mt-2 mx-3 hover:bg-red-400 text-white rounded-md">
                    Clear Screen
                </button>
                <button onClick={handleSaveAsPNG} className="bg-blue-600 px-3 py-1 mt-2 hover:bg-blue-400 text-white rounded-md">
                    Save as PNG
                </button>
            </div>
        </div>
    );
};

export default Canvas;
