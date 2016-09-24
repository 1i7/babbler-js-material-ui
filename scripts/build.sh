#!/bin/sh
rm -rf lib/
./node_modules/.bin/babel --presets es2015,react,stage-1 src/ --out-dir lib/

