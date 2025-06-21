// "use client";

// import { useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import Cookies from 'js-cookie';


// export function useSocket(event, callback) {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!socketRef.current) {
//       const token = Cookies.get('token');
//       socketRef.current = io('http://localhost:8002/events', {
//         auth: { token: token }, // if needed
//       });
//     }

//     const socket = socketRef.current;

//     socket.on(event, callback);
//     return () => socket.off(event, callback);
//   }, [event, callback]);

//   return socketRef.current;
// }

// hooks/useSocket.js
'use client';

import { useEffect } from 'react';
import { getSocket } from '../lib/socket';

export function useSocket(event, callback) {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}
