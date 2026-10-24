import { useEffect, useRef, useState } from 'react';
import { createFaceTracker } from './mediapipe';
import { irisGazePoint } from './gaze';
import type { HeadPoint } from './head';

const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
export function CameraPointer({ mode, enabled, onPoint, onLost }: { mode: 'head' | 'gaze'; enabled: boolean; onPoint: (point: HeadPoint) => void; onLost: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null); const [status, setStatus] = useState<'off' | 'starting' | 'ready' | 'blocked'>('off');
  useEffect(() => { if (!enabled) return undefined; let cancelled = false; let raf = 0; let stream: MediaStream | undefined; let tracker: Awaited<ReturnType<typeof createFaceTracker>> | undefined; const start = async () => { try { setStatus('starting'); stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: false }); if (!videoRef.current) throw new Error('video unavailable'); videoRef.current.srcObject = stream; await videoRef.current.play(); tracker = await createFaceTracker(MODEL); setStatus('ready'); const frame = () => { if (cancelled || !videoRef.current || !tracker) return; const result = tracker.detect(videoRef.current, performance.now()); if (result) onPoint(mode === 'gaze' ? (irisGazePoint(tracker.lastLandmarks) ?? result) : result); else onLost(); raf = requestAnimationFrame(frame); }; frame(); } catch { setStatus('blocked'); onLost(); } }; void start(); return () => { cancelled = true; cancelAnimationFrame(raf); tracker?.close(); stream?.getTracks().forEach(track => track.stop()); }; }, [enabled, mode, onLost, onPoint]);
  return <div className="camera-status"><video ref={videoRef} muted playsInline aria-hidden="true" /><span className={`camera-dot ${status}`} />{status === 'starting' ? 'Starting camera…' : status === 'ready' ? `${mode === 'gaze' ? 'Eye gaze' : 'Head pointer'} ready` : status === 'blocked' ? 'Camera unavailable — mouse and switch remain available' : 'Camera off'}</div>;
}
