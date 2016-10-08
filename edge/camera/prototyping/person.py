import cv2
import numpy as np

def inside(r, q):
    rx, ry, rw, rh = r
    qx, qy, qw, qh = q
    return rx > qx and ry > qy and rx + rw < qx + qw and ry + rh < qy + qh

def drawDetected(frame, rects):
    for x, y, w, h in rects:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 5)

cap = cv2.VideoCapture(0)
hog = cv2.HOGDescriptor()
hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

triggerOn = True
VISUAL = 0
personCount = 0

while( cap.isOpened() and triggerOn ):
    _, frame = cap.read()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame = cv2.equalizeHist(frame)
    found, _ = hog.detectMultiScale(frame, winStride=(8,8), padding=(32,32), scale=1.05, hitThreshold = .71)#.71
    # print len(found)
    found_filt = []
    for ri, r in enumerate(found):
        for qi, q in enumerate(found):
            if ri != qi and inside(r, q):
                break
            else:
                found_filt.append(r)
    print len(found_filt)
    drawDetected(frame, found_filt)
    # print frame.shape
    if VISUAL:
        cv2.imshow('People Counting', frame)
        k = cv2.waitKey(1)
        if k == 27:
            break
cap.release()
cv2.destroyAllWindows()
