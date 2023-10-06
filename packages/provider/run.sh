#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
  npm run build
  serve -s ./build -l 3000
else
  npm run dev
fi
