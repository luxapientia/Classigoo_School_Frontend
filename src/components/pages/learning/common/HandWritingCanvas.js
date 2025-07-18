'use client';

import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import ImageButton from './ImageButton';

const ControlBtns = forwardRef((props, ref) => {
    const [isBtnShown, showBtn] = useState(false);
    useImperativeHandle(ref, () => {
        return {
            showBtn: showBtn
        };
    });
    if (!isBtnShown) return (<div></div>);
    else
        return (
            <div className="flex justify-around">
                <ImageButton width="30px" image_url="eraser.png" onClick={props.erase}></ImageButton>
                <ImageButton width="25px" image_url="checker.png" onClick={props.check}></ImageButton>
            </div>
        )
});

const HandWritingCanvas = React.memo(forwardRef((props, ref) => {
    const canvasRef = useRef();
    const controlBtnsRef = useRef();
    const local = {};
    
    useImperativeHandle(ref, () => {
        return {
            hideControlBtn: hideControlBtn,
            showControlBtn: showControlBtn,
            setCanvasWidth: setCanvasWidth,
            getCanvasWidth: getCanvasWidth
        };
    });
    
    function setCanvasWidth(width) {
        if (canvasRef.current) {
            canvasRef.current.width = width;
        }
    }
    
    function getCanvasWidth() {
        if (canvasRef.current) {
            return canvasRef.current.width;
        }
    }
    
    function hideControlBtn() {
        controlBtnsRef.current.showBtn(false);
    }
    
    function showControlBtn() {
        controlBtnsRef.current.showBtn(true);
    }
    
    function onPointerDown(e) {
        if (props.onDrawStart) {
            props.onDrawStart();
        }
        local.canvas.setPointerCapture(e.pointerId);
        // new stroke
        local.cxt.lineWidth = local.lineWidth;
        local.handwritingX = [];
        local.handwritingY = [];
        local.drawing = true;
        local.cxt.beginPath();
        local.canvas.addEventListener("pointermove", onMouseMove);
        local.canvas.addEventListener("pointerup", onMouseUp);
        var rect = local.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        local.cxt.moveTo(x, y);
        local.handwritingX.push(x);
        local.handwritingY.push(y);
        //
        hideControlBtn();
    }
    
    function onMouseUp(e) {
        local.canvas.removeEventListener("mousemove", onMouseMove);
        local.canvas.removeEventListener("mouseup", onMouseUp);
        var w = [];
        w.push(local.handwritingX);
        w.push(local.handwritingY);
        w.push([]);
        local.trace.push(w);
        local.drawing = false;

        if (local.allowUndo) local.step.push(local.canvas.toDataURL());
        //
        if (props.onDrawEnd)
            props.onDrawEnd(local.trace);
        showControlBtn();
    }
    
    function onMouseMove(e) {
        if (local.drawing) {
            var rect = local.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            local.cxt.lineTo(x, y);
            local.cxt.stroke();
            local.handwritingX.push(x);
            local.handwritingY.push(y);
        }
    }
    
    function onTouchStart(e) {
        if (props.onDrawStart) {
            props.onDrawStart();
        }
        local.canvas.addEventListener("touchmove", onTouchMove);
        local.canvas.addEventListener("touchend", onTouchEnd);
        local.cxt.lineWidth = local.lineWidth;
        local.handwritingX = [];
        local.handwritingY = [];
        var de = document.documentElement;
        var box = local.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var touch = e.changedTouches[0];
        var touchX = touch.pageX - left;
        var touchY = touch.pageY - top;
        local.handwritingX.push(touchX);
        local.handwritingY.push(touchY);
        local.cxt.beginPath();
        local.cxt.moveTo(touchX, touchY);

        hideControlBtn();
    }
    
    function onTouchMove(e) {
        var touch = e.targetTouches[0];
        var de = document.documentElement;
        var box = local.canvas.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        var x = touch.pageX - left;
        var y = touch.pageY - top;
        local.handwritingX.push(x);
        local.handwritingY.push(y);
        local.cxt.lineTo(x, y);
        local.cxt.stroke();
    }
    
    function onTouchEnd(e) {
        local.canvas.removeEventListener("touchmove", onTouchMove);
        local.canvas.removeEventListener("touchend", onTouchEnd);
        var w = [];

        w.push(local.handwritingX);
        w.push(local.handwritingY);
        w.push([]);
        local.trace.push(w);
        if (local.allowUndo) local.step.push(local.canvas.toDataURL());
        //
        if (props.onDrawEnd)
            props.onDrawEnd(local.trace);
        showControlBtn();
    }
    
    useEffect(() => {
        local.callback = props.onCheck;
        initCanvas(canvasRef.current, 1);
        local.trace = props.init_trace || local.trace;
    }, []);

    function initCanvas(cvs, lineWidth) {
        local.canvas = cvs;
        local.cxt = cvs.getContext("2d");
        local.cxt.lineCap = "round";
        local.cxt.lineJoin = "round";
        local.lineWidth = lineWidth || 3;
        local.width = cvs.width;
        local.height = cvs.height;
        local.drawing = false;
        local.handwritingX = [];
        local.handwritingY = [];
        local.trace = [];
        local.options = {
            language: "en",
            numOfReturn: 3
        };
        local.step = [];
        local.redo_step = [];
        local.redo_trace = [];
        local.allowUndo = false;
        local.allowRedo = false;
    }
    
    function erase() {
        local.cxt.clearRect(0, 0, local.width, local.height);
        local.step = [];
        local.redo_step = [];
        local.redo_trace = [];
        local.trace = [];
        hideControlBtn();
        if (props.onErase) {
            props.onErase();
        }
    }
    
    function check() {
        let options = local.options;
        let trace = local.trace;

        var data = JSON.stringify({
            "options": "enable_pre_space",
            "requests": [{
                "writing_guide": {
                    "writing_area_width": options.width || local.width || undefined,
                    "writing_area_height": options.height || local.width || undefined
                },
                "ink": trace,
                "language": options.language || "zh_TW"
            }]
        });
        var xhr = new XMLHttpRequest();
        let callback = local.callback;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                switch (this.status) {
                    case 200:
                        var response = JSON.parse(this.responseText);
                        var results;
                        if (response.length === 1) { callback(undefined, new Error(response[0])); break; }
                        else results = response[1][0][1];
                        if (!!options.numOfWords) {
                            results = results.filter(function (result) {
                                return (result.length === options.numOfWords);
                            });
                        }
                        if (!!options.numOfReturn) {
                            results = results.slice(0, options.numOfReturn);
                        }
                        callback(results, undefined);
                        break;
                    case 403:
                        callback(undefined, new Error("access denied"));
                        break;
                    case 503:
                        callback(undefined, new Error("can't connect to recognition server"));
                        break;
                    default:
                }
            }
        });
        xhr.open("POST", "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);
    }
    
    let width = 76;
    let height = 78;
    if (props.width) width = props.width;
    if (props.height) height = props.height;
    
    return (
        <React.Fragment>
            <canvas 
                ref={canvasRef} 
                width={width} 
                height={height} 
                style={{ cursor: "crosshair" }}
                onPointerDown={onPointerDown}
                onTouchStart={onTouchStart}
            >
            </canvas>
            <ControlBtns ref={controlBtnsRef} erase={erase} check={check}></ControlBtns>
        </React.Fragment>
    );
}));

export default HandWritingCanvas; 