package main

import (
	"log"
	"net"
	"net/http"
	"net/rpc"

	"github.com/eecs-susu/service-oriented-architecture/task-2/server/bboard"
)

func main() {
	arith := new(bboard.Arith)
	rpc.Register(arith)
	rpc.HandleHTTP()
	l, e := net.Listen("tcp", ":1234")
	if e != nil {
		log.Fatal("listen error:", e)
	}
	http.Serve(l, nil)
}
