"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Camera, CheckCircle2, XCircle } from "lucide-react"

interface FaceAgeVerificationProps {
  claimedAge: number
  onVerificationComplete: (success: boolean) => void
}

export function FaceAgeVerification({ claimedAge, onVerificationComplete }: FaceAgeVerificationProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedAge, setDetectedAge] = useState<number | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)

  // Simplified face detection - always succeed for demo
  const simulateFaceDetection = async () => {
    // Simulate age close to claimed age with slight variation
    const minVariation = Math.max(2, Math.round(claimedAge * 0.1))
    const variation = Math.floor(Math.random() * minVariation * 2) - minVariation
    return claimedAge + variation
  }

  // Simplified age verification check
  const checkAgeVerification = (detectedAge: number, claimedAge: number) => {
    // Allow for some margin of error in age detection (15% or at least 5 years)
    const margin = Math.max(5, claimedAge * 0.15)
    return Math.abs(detectedAge - claimedAge) <= margin
  }

  useEffect(() => {
    // Simulate loading face detection models
    const timer = setTimeout(() => {
      setModelsLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const startCamera = async () => {
    setError(null)
    setIsCapturing(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Unable to access camera. Please ensure you've granted camera permissions.")
      setIsCapturing(false)
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    setError(null)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) throw new Error("Could not get canvas context")

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Simulate face detection with a slight delay
      setTimeout(async () => {
        // Get simulated detected age
        const age = await simulateFaceDetection()
        setDetectedAge(age)

        // Verify age
        const verified = checkAgeVerification(age, claimedAge)
        setIsVerified(verified)
        onVerificationComplete(verified)

        setIsProcessing(false)

        // Stop the camera
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }

        setIsCapturing(false)
      }, 1500)
    } catch (err) {
      setError("Error processing image. Please try again.")
      setIsVerified(false)
      onVerificationComplete(false)
      setIsProcessing(false)
      setIsCapturing(false)

      // Stop the camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }

  const retryVerification = () => {
    setDetectedAge(null)
    setIsVerified(null)
    setError(null)
  }

  if (!modelsLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center">Loading face detection models...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Age Verification</h3>
            <p className="text-sm text-muted-foreground">Please verify your age by taking a quick photo</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            {isCapturing ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : detectedAge !== null ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                {isVerified ? (
                  <>
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                    <p className="font-medium">Age Verified!</p>
                    <p className="text-sm text-muted-foreground">Detected age: ~{detectedAge} years</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-16 w-16 text-red-500 mb-2" />
                    <p className="font-medium">Verification Failed</p>
                    <p className="text-sm text-muted-foreground">
                      Detected age (~{detectedAge} years) doesn't match your provided age.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Camera will appear here</p>
              </div>
            )}
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center">
            {isCapturing ? (
              <Button onClick={captureImage} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Capture Photo"
                )}
              </Button>
            ) : detectedAge !== null ? (
              <Button onClick={retryVerification} variant="outline" className="w-full">
                Try Again
              </Button>
            ) : (
              <Button onClick={startCamera} className="w-full">
                Start Camera
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

