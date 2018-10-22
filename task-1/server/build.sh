#!/bin/bash
mkdir src
mkdir src/app
mv application.go src/app/app.go
cd src/app
go get ./. 
cd ../..
go build -o bin/application src/app/app.go
