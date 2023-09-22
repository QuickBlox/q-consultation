#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
  npm run build
  serve -s ./build -l 3001
else
  npm run dev
fi
