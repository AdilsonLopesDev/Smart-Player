const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    user = os.userInfo(),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

//#region Access to SO
var INIT = {
    file: [],
    directories: [],
    extensions: null,
    musicIcon: `data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDE1Ljk2MyA0MTUuOTYzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MTUuOTYzIDQxNS45NjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgY2xhc3M9IiI+PGc+PHBhdGggZD0iTTMyOC43MTIsMjY0LjUzOWMxMi45MjgtMjEuNjMyLDIxLjUwNC00OC45OTIsMjMuMTY4LTc2LjA2NGMxLjA1Ni0xNy4zNzYtMi44MTYtMzUuNjE2LTExLjItNTIuNzY4ICBjLTEzLjE1Mi0yNi45NDQtMzUuNzQ0LTQyLjA4LTU3LjU2OC01Ni43MDRjLTE2LjI4OC0xMC45MTItMzEuNjgtMjEuMjE2LTQyLjU2LTM1LjkzNmwtMS45NTItMi42MjQgIGMtNi40MzItOC42NC0xMy42OTYtMTguNDMyLTE0Ljg0OC0yNi42NTZjLTEuMTUyLTguMzItOC43MDQtMTQuMjQtMTYuOTYtMTMuNzZjLTguMzg0LDAuNTc2LTE0Ljg4LDcuNTItMTQuODgsMTUuOTM2djI4NS4xMiAgYy0xMy40MDgtOC4xMjgtMjkuOTItMTMuMTItNDgtMTMuMTJjLTQ0LjA5NiwwLTgwLDI4LjcwNC04MCw2NHMzNS45MDQsNjQsODAsNjRzODAtMjguNzA0LDgwLTY0VjE2NS40NjcgIGMyNC4wMzIsOS4xODQsNjMuMzYsMzIuNTc2LDc0LjE3Niw4Ny4yYy0yLjAxNiwyLjk3Ni0zLjkzNiw2LjE3Ni02LjE3Niw4LjczNmMtNS44NTYsNi42MjQtNS4yMTYsMTYuNzM2LDEuNDQsMjIuNTYgIGM2LjU5Miw1Ljg4OCwxNi43MDQsNS4xODQsMjIuNTYtMS40NGM0LjI4OC00Ljg2NCw4LjA5Ni0xMC41NiwxMS43NDQtMTYuNTEyQzMyOC4wNCwyNjUuNTYzLDMyOC4zOTMsMjY1LjA4MywzMjguNzEyLDI2NC41Mzl6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNEMzE2MTYiIGRhdGEtb2xkX2NvbG9yPSIjRUIyMDIwIj48L3BhdGg+PC9nPiA8L3N2Zz4=`,
    videoIcon: `data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDgwIDQ4MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgwIDQ4MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48Zz48Zz4KCTxnPgoJCTxnPgoJCQk8cmVjdCB4PSI1NiIgeT0iMTM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMjQiIHk9IjEzNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9Ijg4IiB5PSIxMzYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIxMjAiIHk9IjEzNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjE1MiIgeT0iMTM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMTg0IiB5PSIxMzYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIyMTYiIHk9IjEzNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjI0OCIgeT0iMTM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMjgwIiB5PSIxMzYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIzMTIiIHk9IjEzNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjM0NCIgeT0iMTM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMzc2IiB5PSIxMzYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSI0MDgiIHk9IjEzNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjQ0MCIgeT0iMTM2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iNTYiIHk9IjM5MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjI0IiB5PSIzOTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSI4OCIgeT0iMzkyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMTIwIiB5PSIzOTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIxNTIiIHk9IjM5MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjE4NCIgeT0iMzkyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMjE2IiB5PSIzOTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIyNDgiIHk9IjM5MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjI4MCIgeT0iMzkyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iMzEyIiB5PSIzOTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSIzNDQiIHk9IjM5MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxyZWN0IHg9IjM3NiIgeT0iMzkyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcmVjdD4KCQkJPHJlY3QgeD0iNDA4IiB5PSIzOTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9yZWN0PgoJCQk8cmVjdCB4PSI0NDAiIHk9IjM5MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiNFRTBGMEYiIGRhdGEtb2xkX2NvbG9yPSIjRUUxMTExIj48L3JlY3Q+CgkJCTxwYXRoIGQ9Ik00NzIsMTA0aC0zMlY4MGMwLTQuNDE4LTMuNTgyLTgtOC04aC0zMlY0OGMwLTQuNDE4LTMuNTgyLTgtOC04SDg4Yy00LjQxOCwwLTgsMy41ODItOCw4djI0SDQ4Yy00LjQxOCwwLTgsMy41ODItOCw4djI0ICAgICBIOGMtNC40MTgsMC04LDMuNTgyLTgsOHYzMjBjMCw0LjQxOCwzLjU4Miw4LDgsOGg0NjRjNC40MTgsMCw4LTMuNTgyLDgtOFYxMTJDNDgwLDEwNy41ODIsNDc2LjQxOCwxMDQsNDcyLDEwNHogTTk2LDU2aDI4OHYxNiAgICAgSDk2VjU2eiBNNTYsODhoMzY4djE2SDU2Vjg4eiBNNDY0LDQyNEgxNlYxMjBoNDQ4VjQyNHoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0VFMEYwRiIgZGF0YS1vbGRfY29sb3I9IiNFRTExMTEiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTIwMCwzNDYuNTA0YzAsNC40MTgsMy41ODIsOCw4LDhjMS42MzksMC4wMDEsMy4yNC0wLjUwMiw0LjU4NC0xLjQ0bDEwNi41MTItNzQuNTEyICAgICBjMC43NjMtMC41MzUsMS40MjctMS4xOTksMS45NjItMS45NjJjMi41MzUtMy42MTksMS42NTctOC42MDctMS45NjItMTEuMTQybC0xMDYuNTEyLTc0LjUxMiAgICAgYy0xLjM0NS0wLjk0LTIuOTQ2LTEuNDQ0LTQuNTg4LTEuNDQ0Yy00LjQxOCwwLjAwMi03Ljk5OCwzLjU4NS03Ljk5Niw4LjAwNFYzNDYuNTA0eiBNMjE2LDIxMi44NDhMMzAwLjU1MiwyNzJMMjE2LDMzMS4xNTIgICAgIFYyMTIuODQ4eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojRUUwRjBGIiBkYXRhLW9sZF9jb2xvcj0iI0VFMTExMSI+PC9wYXRoPgoJCTwvZz4KCTwvZz4KPC9nPjwvZz4gPC9zdmc+`,
    folderIcon: `data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTggNTgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU4IDU4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGNsYXNzPSIiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiNFRkNFNEE7IiBkPSJNNTUuOTgxLDU0LjVIMi4wMTlDMC45MDQsNTQuNSwwLDUzLjU5NiwwLDUyLjQ4MVYyMC41aDU4djMxLjk4MUM1OCw1My41OTYsNTcuMDk2LDU0LjUsNTUuOTgxLDU0LjV6ICAiIGRhdGEtb3JpZ2luYWw9IiNFRkNFNEEiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBzdHlsZT0iZmlsbDojRUJCQTE2OyIgZD0iTTI2LjAxOSwxMS41VjUuNTE5QzI2LjAxOSw0LjQwNCwyNS4xMTUsMy41LDI0LDMuNUgyLjAxOUMwLjkwNCwzLjUsMCw0LjQwNCwwLDUuNTE5VjEwLjV2MTBoNTggIHYtNi45ODFjMC0xLjExNS0wLjkwNC0yLjAxOS0yLjAxOS0yLjAxOUgyNi4wMTl6IiBkYXRhLW9yaWdpbmFsPSIjRUJCQTE2IiBjbGFzcz0iIj48L3BhdGg+PGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRTYxMTAxIiBkPSJNMTgsMzIuNWgxNGMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMUgxOGMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxNy40NDgsMzIuNSwxOCwzMi41eiIgZGF0YS1vcmlnaW5hbD0iI0VCNzkzNyIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iI0U2MTIwMiI+PC9wYXRoPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U2MTEwMSIgZD0iTTE4LDM4LjVoMjJjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFIMThjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTMTcuNDQ4LDM4LjUsMTgsMzguNXoiIGRhdGEtb3JpZ2luYWw9IiNFQjc5MzciIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiNFNjEyMDIiPjwvcGF0aD4KCTxwYXRoIHN0eWxlPSJmaWxsOiNFNjExMDEiIGQ9Ik00MCw0Mi41SDE4Yy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDIyYzAuNTUyLDAsMS0wLjQ0NywxLTFTNDAuNTUyLDQyLjUsNDAsNDIuNXoiIGRhdGEtb3JpZ2luYWw9IiNFQjc5MzciIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiNFNjEyMDIiPjwvcGF0aD4KPC9nPjwvZz4gPC9zdmc+`,
    imageIcon: `data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUwMy42ODkgNTAzLjY4OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAzLjY4OSA1MDMuNjg5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiNFNEU3RTc7IiBkPSJNMTYuNTAyLDEzNS44MzhMMzk2LjU2NCwzNC4yMjVjMTEuODE1LTMuMTUxLDI0LjQxOCwzLjkzOCwyNy41NjksMTUuNzU0bDc1LjIyNSwyNzkuMjM3ICBjMy4xNTEsMTEuODE1LTMuOTM4LDI0LjAyNS0xNi4xNDgsMjcuMTc1TDEwMy4xNDksNDU4LjAwNGMtMTEuODE1LDMuMTUxLTI0LjQxOC0zLjkzOC0yNy41NjktMTUuNzU0TDAuNzQ5LDE2My4wMTMgIEMtMi40MDIsMTUxLjE5OCw0LjY4NywxMzguOTg5LDE2LjUwMiwxMzUuODM4eiIgZGF0YS1vcmlnaW5hbD0iI0U0RTdFNyI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiMyMDhEQjI7IiBkPSJNNDguNDA0LDE1OC4yODdMMzgwLjgxLDY5LjY3MmM5LjA1OC0yLjM2MywxOC41MTEsMy4xNTEsMjEuMjY4LDEyLjIwOWw2Mi4yMjgsMjMxLjE4OCAgYzIuMzYzLDkuMDU4LTMuMTUxLDE4LjUxMS0xMi4yMDksMjAuODc0TDExOS42OSw0MjIuNTU4Yy05LjA1OCwyLjM2My0xOC41MTEtMy4xNTEtMjEuMjY4LTEyLjIwOUwzNi4xOTUsMTc5LjE2MSAgQzMzLjQzOCwxNzAuMTAyLDM4Ljk1MiwxNjAuNjUsNDguNDA0LDE1OC4yODd6IiBkYXRhLW9yaWdpbmFsPSIjMjA4REIyIj48L3BhdGg+PHBhdGggc3R5bGU9ImZpbGw6I0YzRjNGMzsiIGQ9Ik04NS40MjUsMTMxLjg5OUg0ODEuMjRjMTIuNjAzLDAsMjIuNDQ5LDEwLjI0LDIyLjQ0OSwyMi40NDl2MjkzLjQxNSAgYzAsMTIuNjAzLTEwLjI0LDIyLjQ0OS0yMi40NDksMjIuNDQ5SDg1LjQyNWMtMTIuNjAzLDAtMjIuNDQ5LTEwLjI0LTIyLjQ0OS0yMi40NDlWMTU0LjM0OSAgQzYyLjk3NiwxNDIuMTM5LDczLjIxNiwxMzEuODk5LDg1LjQyNSwxMzEuODk5eiIgZGF0YS1vcmlnaW5hbD0iI0YzRjNGMyI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiNBM0UwRjU7IiBkPSJNMTExLjgxMywxNjMuNDA3aDM0My44MjhjOS40NTIsMCwxNy4zMjksNy44NzcsMTcuMzI5LDE3LjMyOVY0MjEuNzcgIGMwLDkuNDUyLTcuODc3LDE3LjMyOS0xNy4zMjksMTcuMzI5SDExMS44MTNjLTkuNDUyLDAtMTcuMzI5LTcuODc3LTE3LjMyOS0xNy4zMjlWMTgwLjczNiAgQzk0LjQ4NCwxNzEuMjg0LDEwMS45NjcsMTYzLjQwNywxMTEuODEzLDE2My40MDd6IiBkYXRhLW9yaWdpbmFsPSIjQTNFMEY1Ij48L3BhdGg+PHBhdGggc3R5bGU9ImZpbGw6I0VGQzc1RTsiIGQ9Ik05NC40ODQsMTgwLjczNnY4NC4yODNjMy45MzgsMC4zOTQsNy44NzcsMC43ODgsMTEuODE1LDAuNzg4YzUwLjAxOCwwLDkwLjU4NS00MC41NjYsOTAuNTg1LTkwLjU4NSAgYzAtMy45MzgtMC4zOTQtNy44NzctMC43ODgtMTEuODE1aC04NC4yODNDMTAxLjk2NywxNjMuNDA3LDk0LjQ4NCwxNzEuMjg0LDk0LjQ4NCwxODAuNzM2eiIgZGF0YS1vcmlnaW5hbD0iI0VGQzc1RSI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiMzREIzOUU7IiBkPSJNMTIzLjIzNSwzNTYuMzkyYy05Ljg0NiwwLTE5LjY5MiwwLjc4OC0yOC43NTEsMS45Njl2NjMuNDA5YzAsOS40NTIsNy44NzcsMTcuMzI5LDE3LjMyOSwxNy4zMjkgIGgxMzEuMTUxYzAuNzg4LTMuNTQ1LDEuMTgyLTYuNjk1LDEuMTgyLTEwLjI0QzI0NC4xNDUsMzg4LjY4NywxOTAuMTg5LDM1Ni4zOTIsMTIzLjIzNSwzNTYuMzkyeiIgZGF0YS1vcmlnaW5hbD0iIzNEQjM5RSI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiM0QkMyQUQ7IiBkPSJNMzk3Ljc0NSwzMjAuOTQ1Yy0xMDcuOTE0LDAtMTk1Ljc0Miw1Mi43NzUtMTk2LjkyMywxMTguMTU0aDI1NC40MjUgIGM5LjQ1MiwwLDE3LjMyOS03Ljg3NywxNy4zMjktMTcuMzI5di05MS43NjZDNDQ5LjMzOSwzMjQuNDksNDI0LjEzMywzMjAuOTQ1LDM5Ny43NDUsMzIwLjk0NXoiIGRhdGEtb3JpZ2luYWw9IiM0QkMyQUQiPjwvcGF0aD48L2c+IDwvc3ZnPg=="`,
    textIcon: `data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJGaWxlIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCAxNDQuMDgzIDE0NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTQ0LjA4MyAxNDQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik04Ni43MDgsMjQuMDM1SDQ2LjI2M2MtNi45NDQsMC0xMi41OTQsNS42NDktMTIuNTk0LDEyLjU5M3Y3MC43NDNjMCw2Ljk0Myw1LjY0OSwxMi41OTQsMTIuNTk0LDEyLjU5NGg1MS41NTkgIGM2Ljk0MywwLDEyLjU5My01LjY0OCwxMi41OTMtMTIuNTk0VjUwLjUzM0w4Ni43MDgsMjQuMDM1eiBNODguMzY2LDM0Ljg4OGwxMi4zMzgsMTMuNzkxSDg4LjM2NlYzNC44ODh6IE05Ny44MjIsMTEzLjk2NUg0Ni4yNjMgIGMtMy42MzYsMC02LjU5NC0yLjk1OC02LjU5NC02LjU5NFYzNi42MjhjMC0zLjYzNSwyLjk1OC02LjU5Myw2LjU5NC02LjU5M2gzNi4xMDN2MjQuNjQ0aDIyLjA0OXY1Mi42OTIgIEMxMDQuNDE1LDExMS4wMDcsMTAxLjQ1OCwxMTMuOTY1LDk3LjgyMiwxMTMuOTY1eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCI+PC9wYXRoPjxyZWN0IHg9IjYyLjYyNSIgeT0iNjMuOTk5IiB3aWR0aD0iMjcuNjY3IiBoZWlnaHQ9IjYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiPjwvcmVjdD48cmVjdCB4PSI2Mi42MjUiIHk9Ijc3LjgzMiIgd2lkdGg9IjI3LjY2NyIgaGVpZ2h0PSI2IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIj48L3JlY3Q+PHJlY3QgeD0iNjIuNjI1IiB5PSI5MS42NjQiIHdpZHRoPSIyNy42NjciIGhlaWdodD0iNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCI+PC9yZWN0PjxyZWN0IHg9IjUxLjA4MiIgeT0iNjMuOTk5IiB3aWR0aD0iNS43NTMiIGhlaWdodD0iNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCI+PC9yZWN0PjxyZWN0IHg9IjUxLjA4MiIgeT0iNzcuODMyIiB3aWR0aD0iNS43NTMiIGhlaWdodD0iNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCI+PC9yZWN0PjxyZWN0IHg9IjUxLjA4MiIgeT0iOTEuNjY0IiB3aWR0aD0iNS43NTMiIGhlaWdodD0iNiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCI+PC9yZWN0PjwvZz4gPC9zdmc+"`,
}
const SO_ACCESS = {
    //TODO: All logic to handle with System Oparation
    /**
     * Initialization 
     */
    init: () => {
        SO_ACCESS.getExtensions(e => {
            INIT.extensions = e;
        })
        return INIT;
    },

    listDrives: (callback) => {
        exec('wmic logicaldisk get name', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            var data = Buffer.from(stdout).toString('utf8');
            let contents = data.split('\r\r\n').filter(value => /[A-Za-z]:/.test(value)).map(value => value.trim());
            let drives = [];
            contents.map(i => {
                drives.push({
                    Name: i.toUpperCase()
                });
            })
            callback(drives)
        });
    },
    isDirectory: (pathname) => {
        try {
            return typeof pathname == 'string' ? fs.lstatSync(pathname).isDirectory() : false;
        } catch (error) {
            return false;
        }
    },
    readDirectories: (dirname = 'c:/') => {
        INIT.directories = [];
        /**read directories & map them */
        fs.readdirSync(dirname).map(dir => {
            const dirObject = { dirname: null, fullPath: null, icon: null, contentType: null },
                next = path.join(dirname, dir);
            if (SO_ACCESS.isDirectory()) {
                dirObject.icon = INIT.folderIcon;
                INIT.directories.push(dirObject);
            } else {
                let extension = path.extname(next);
                SO_ACCESS.fillDirectories(extension, { dir: dir, dirname: dirname })
            }
        })
        return INIT.directories;
    },
    fillDirectories: (extension, dirSet) => {
        const dirObject = { dirname: null, fullPath: null, icon: null, contentType: null };
        if (SO_ACCESS.isFileOfType(extension, 'audio')) {
            dirObject.icon = INIT.musicIcon;
            dirObject.contentType = 'audio';
        } else if (SO_ACCESS.isFileOfType(extension, 'video')) {
            dirObject.icon = INIT.videoIcon;
            dirObject.contentType = 'video';
        } else if (SO_ACCESS.isFileOfType(extension, 'img')) {
            const img = `${dirSet.dirname}${dirSet.dir}`,
                buffImage = fs.readFileSync(img),
                base64data = buffImage.toString('base64');
            dirObject.icon = `data:image/png;base64,${base64data}`;
            dirObject.contentType = 'img';
        } else if (extension === '.txt' || extension === '.css') {
            dirObject.icon = INIT.textIcon;
            dirObject.contentType = 'txt';
        } else {
            dirObject.icon = INIT.folderIcon;
            dirObject.contentType = 'folder';
        }

        dirObject.title = dirSet.dir; //name of the file (folder)
        dirObject.fullPath = `${dirSet.dirname}${dirSet.dir}`; //Full directory
        INIT.directories.push(dirObject);
    },
    isFileOfType: (file, type) => {
        let flag = false;
        INIT.extensions[type].map(i => {
            if (file.toString().toLowerCase().trim().endsWith(i)) {
                flag = true;
            }
        })
        return flag;
    },
    getExtensions: async(callback) => {
        let fileStream = fs.createReadStream('helpers/extensions.txt'),
            data = "";

        fileStream.on('readable', function() {
            //this functions reads chunks of data and emits newLine event when \n is found
            data += fileStream.read();
            while (data.indexOf('\n') >= 0) {
                fileStream.emit('newLine', data.substring(0, data.indexOf('\n')));
                data = data.substring(data.indexOf('\n') + 1);

            }
        });

        fileStream.on('end', function() {
            //this functions sends to newLine event the last chunk of data and tells it
            //that the file has ended
            fileStream.emit('newLine', data, true);
        });

        var statement = { allfiles: [] };

        fileStream.on('newLine', async function(line_of_text, end_of_file) {
            //this is the code where you handle each line
            // line_of_text = string which contains one line
            // end_of_file = true if the end of file has been reached

            var arrayOfExtensionType = line_of_text.split("="),
                extensions = arrayOfExtensionType[1]
                .replace('\r', '') // remove \r caracter if have
                .replace('null', '') // remove null caracter if have
                .replace("[", "") // remove [ caracter if have
                .replace("]", "") // remove ] caracter if have
                .split(','), // transform to array
                type = arrayOfExtensionType[0].trim();
            statement[type] = extensions;
            //load all extensions
            extensions.map(i => {
                statement.allfiles.push(i);
            })

            if (end_of_file) {
                statement['audioorvideo'] = statement.audio.concat(statement.video)
                callback(statement);
                INIT.extensions = statement;
                //here you have your statement object ready
            }

        });
    },
    test: () => {
        INIT.file.push(1)
        console.log(INIT)
    }
}
SO_ACCESS.init()
module.exports = SO_ACCESS;
//#endregion