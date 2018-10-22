package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net"
	"strconv"

	"github.com/eecs-susu/service-oriented-architecture/task-1/rpn"
)

func handleExpression(expression string) string {
	postfixNotation, err := rpn.FromInfixNotation(expression)
	if err != nil {
		return fmt.Sprintf("error -> %s", err.Error())
	}
	value, err := rpn.Calculate(postfixNotation)
	if err != nil {
		return fmt.Sprintf("error -> %s", err.Error())
	}
	return strconv.FormatFloat(value, 'g', -1, 64)
}

func handleConnection(conn net.Conn) {
	name := conn.RemoteAddr().String()

	log.Printf("%+v connected\n", name)
	conn.Write([]byte("You're connected from " + name + "\n"))

	defer conn.Close()

	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		text := scanner.Text()
		if text == "Exit" || text == "exit" {
			conn.Write([]byte("Bye\n\r"))
			log.Println(name, "disconnected")
			break
		} else {
			log.Println(name, "enters", text)
			conn.Write([]byte(handleExpression(text) + "\n\r"))
		}
	}
}

func main() {
	port := flag.String("port", "5000", "Port")
	flag.Parse()
	listner, err := net.Listen("tcp", ":"+*port)
	if err != nil {
		panic(err)
	}
	for {
		conn, err := listner.Accept()
		if err != nil {
			panic(err)
		}
		go handleConnection(conn)
	}
}
