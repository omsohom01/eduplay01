import cv2
from deepface import DeepFace

# Start webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        # Analyze the detected face for age estimation
        analysis = DeepFace.analyze(frame, actions=["age"], enforce_detection=False)

        # Extract age
        age = int(analysis[0]["age"])
        access = "Granted" if age >= 18 else "Denied"

        # Display results on the webcam feed
        cv2.putText(frame, f"Age: {age} | Access: {access}", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0) if access == "Granted" else (0, 0, 255), 2)

    except Exception as e:
        print("Face not detected")

    # Show webcam feed
    cv2.imshow("Age Verification", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
