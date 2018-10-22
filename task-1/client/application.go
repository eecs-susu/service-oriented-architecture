package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"strings"
)

func receive(conn net.Conn, messagesPool chan string) {
	for {
		buff := make([]byte, 4096)
		n, err := conn.Read(buff)
		if err != nil {
			if err == io.EOF {
				log.Printf("Connection closed by remote server\n")
				os.Exit(0)
				break
			}
			log.Printf("Unable to receive message: %s\n", err.Error())
			break
		}
		if n > 0 {
			messagesPool <- string(buff)
		}
	}
}

func getResponse(responseMessages chan string) string {
	select {
	case response := <-responseMessages:
		return response
	}
}

func main() {
	address := flag.String("address", "localhost:5000", "Host in format host:port")
	flag.Parse()

	conn, err := net.Dial("tcp", *address)
	if err != nil {
		log.Printf("Unable to establish connection to \"%s\": %s\n", *address, err.Error())
		return
	}
	defer func() {
		conn.Close()
		log.Println("Connection closed")
	}()

	responseMessages := make(chan string)
	go receive(conn, responseMessages)

	log.Printf("Connecting to server %s\n\n", *address)
	fmt.Printf("%s\n", getResponse(responseMessages))

	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Printf("Expression: ")
		request, _ := reader.ReadString('\n')
		_, err := conn.Write([]byte(request))
		if err != nil {
			log.Printf("Unable to send message: %s\n", err.Error())
			return
		}
		response := getResponse(responseMessages)
		if strings.HasPrefix(response, "Bye") {
			return
		}
		fmt.Printf("%s\n", response)
	}
}
