
SRCS	= ./src/ext.ts ./src/stempad.ts ./src/uuid.ts

default: ./www/stempad.min.js

stempad.js: $(SRCS) Makefile
	tsc --noImplicitAny --out stempad.js $(SRCS)

./www/stempad.min.js: stempad.js Makefile
	node ./tool/minimize.js	