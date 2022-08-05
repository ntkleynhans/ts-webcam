import base64
import json
import cv2
import time
from http.server import BaseHTTPRequestHandler, HTTPServer


class GetHandler(BaseHTTPRequestHandler):

    def __init__(self, cap, *args):
        self.cap = cap
        BaseHTTPRequestHandler.__init__(self, *args)

    def do_GET(self):
        _, frame = self.cap.read()
        img = cv2.imencode('.jpg',frame)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        message = json.dumps({'data': base64.b64encode(img[1]).decode('utf-8')})
        self.wfile.write(message.encode('utf-8'))
        return


if __name__ == '__main__':
    hostName = "localhost"
    serverPort = 8080
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 300)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 300)
    time.sleep(5)
    def handler(*args):
        GetHandler(cap, *args)

    webServer = HTTPServer((hostName, serverPort), handler)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    cap.release()
    webServer.server_close()
    print("Server stopped.")

