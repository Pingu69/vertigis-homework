import http.server
import socketserver

PORT = 8080
ADDRESS = "0.0.0.0"

httpd = socketserver.TCPServer((ADDRESS, PORT), http.server.SimpleHTTPRequestHandler)
print("Serving at {}:{}\n\rPress CTRL+C to exit...".format(ADDRESS, PORT))
httpd.serve_forever()