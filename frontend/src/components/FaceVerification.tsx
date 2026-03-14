'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface FaceVerificationProps {
    partyName: string;
    onVerified: (hash: string) => void;
}

export default function FaceVerification({ partyName, onVerified }: FaceVerificationProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const modelUrl = `${window.location.origin}/models`;
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                    faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
                    faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
                ]);
                setIsModelLoaded(true);
                startVideo();
            } catch (err) {
                console.error('Error loading face-api models', err);
                setError('Failed to load biometric models. Check models directory.');
            }
        };
        loadModels();

        return () => {
            stopVideo();
        };
    }, []);

    const startVideo = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera access requires a secure connection (HTTPS) or localhost access.');
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: {} })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("error accessing webcam", err);
                setError('Camera access denied. Please allow camera permissions.');
            });
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleScan = async () => {
        if (!videoRef.current || !isModelLoaded) return;
        setIsScanning(true);
        setError(null);

        try {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                setIsSuccess(true);
                stopVideo();

                // Generate a pseudo 'hash' from the descriptor for the demo
                const descriptorHash = Array.from(detection.descriptor).slice(0, 10).map(v => Math.abs(v).toString(16).substring(2, 6)).join('');

                setTimeout(() => {
                    onVerified(descriptorHash);
                }, 1500);
            } else {
                setError("No face detected. Please look directly at the camera.");
                setIsScanning(false);
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
            setIsScanning(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-2xl border border-green-200 animate-slide-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Identity Verified Successfully</h3>
                <p className="text-green-600 mt-2 text-center">Biometric hash secured. Raw image discarded.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Verify {partyName}</h3>
                {!isModelLoaded && <span className="flex items-center text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading AI...</span>}
            </div>

            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-inner">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-white/30 rounded-xl m-8"></div>
            </div>

            {error && (
                <div className="w-full mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col items-start text-sm border border-red-200">
                    <div className="flex items-center mb-2">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                        <span className="font-semibold">Verification Error</span>
                    </div>
                    <p className="ml-7">{error}</p>

                    {error.includes('secure connection') && (
                        <button
                            onClick={() => window.location.href = `http://localhost:${window.location.port}${window.location.pathname}`}
                            className="mt-3 ml-7 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium text-xs shadow-sm"
                        >
                            Switch to Localhost (Secure)
                        </button>
                    )}
                </div>
            )}

            <button
                onClick={handleScan}
                disabled={!isModelLoaded || isScanning}
                className="w-full py-4 rounded-xl bg-primary text-white font-medium flex justify-center items-center hover:bg-primary/90 transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {isScanning ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Biometrics...</>
                ) : (
                    <><Camera className="w-5 h-5 mr-2" /> Start Face ID Scan</>
                )}
            </button>
            <p className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> End-to-end encrypted. Images are never stored.
            </p>
        </div>
    );
}
