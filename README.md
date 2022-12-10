# datepicker-app

This project contains source code for datepicker app. The repo contains both the backend and the frontend. The backend created with AWS SAM, Lambda function and API Gateway, and the frontend created with basic HTML page. 

- **backend** - Code for the backend's Lambda function.
- **frontend** - Code for the frontend's HTML page. 
- **backend/template.yaml** - A template that defines the application's AWS resources.

## How to run the backend

**NOTE: To run/invoke your functions locally, your Docker should be running on your machine.**

**NOTE: Adjust the Lambda function's Node version in the `template.yaml` by your computer Node version.**

- Navigate to the `backend` directory in the terminal.
- Run `npm i`.
- Build the Lambda function with `sam build`.
- Run the Lambda and the API Gateway with `sam local start-api --port 3003`.

## How to run the frontend

- Download `Live Preview` extention for your IDE. For VS Code: [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server).
- Run the extention.
- Go to `http://127.0.0.1:3001/frontend/index.html?productVariantId=PRODUCT_VARIANT_ID` (instead `PRODUCT_VARIANT_ID` enter your desired variant id).

Enjoy ✌️
