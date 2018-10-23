package main

import (
	"fmt"
	"log"
	"net/rpc"

	"github.com/eecs-susu/service-oriented-architecture/task-2/server/bboard"
)

func main() {
	client, err := rpc.DialHTTP("tcp", "localhost:1234")
	if err != nil {
		log.Fatal("dialing:", err)
	}
	// Synchronous call
	args := &bboard.Args{7, 8}
	var reply int
	err = client.Call("Arith.Multiply", args, &reply)
	if err != nil {
		log.Fatal("arith error:", err)
	}
	fmt.Printf("Arith: %d*%d=%d\n", args.A, args.B, reply)
}
