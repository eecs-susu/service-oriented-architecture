package rpn

import (
	"bytes"
	"fmt"
	"log"
	"strconv"
	"strings"
	"unicode"

	"github.com/golang-collections/collections/stack"
)

var priorities = map[rune]int{
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
}

func getPriority(r rune) int {
	if priority, ok := priorities[r]; ok {
		return priority
	}
	return 0
}

// FromInfixNotation converts infix notation to reverse polish notation
func FromInfixNotation(in string) (rpn string, err error) {
	maybeUnary := true
	operations := stack.New()
	items := make([]string, 0)
	number := new(bytes.Buffer)
	isNegative := false
	pushNumber := func() {
		if number.Len() > 0 {
			val := number.String()
			if isNegative {
				val = "-" + val
				isNegative = false
			}
			items = append(items, val)
			number.Reset()
		}
	}

	pushOperations := func(operation rune) (wasOpenBracket bool) {
		for operations.Len() > 0 && getPriority(operation) <= getPriority(operations.Peek().(rune)) {
			if op := operations.Pop().(rune); op == '(' {
				wasOpenBracket = true
				break
			} else {
				items = append(items, string(op))
			}
		}
		return
	}

	for _, r := range in {
		if unicode.IsDigit(r) {
			number.WriteRune(r)
			maybeUnary = false
		} else {
			pushNumber()
			switch {
			case strings.ContainsRune("+-/*", r):
				if strings.ContainsRune("-", r) && maybeUnary {
					isNegative = !isNegative
				} else if !(strings.ContainsRune("+", r) && maybeUnary) {
					pushOperations(r)
					operations.Push(r)
				}
				maybeUnary = false
			case r == '(':
				operations.Push(r)
				maybeUnary = true
			case r == ')':
				findOpenBracket := pushOperations(r)
				if !findOpenBracket {
					err = fmt.Errorf("unexpected charcter: '%c'", r)
					return
				}
				maybeUnary = false
			case r != ' ':
				err = fmt.Errorf("unexpected charcter: '%c'", r)
				return
			}
		}
	}
	pushNumber()
	pushOperations('0')
	rpn = strings.Join(items, " ")
	return
}

// Calculate calculates expression in reverse polish notation
func Calculate(rpn string) (value float64, err error) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Recover panic in Calculate", r)
			err = fmt.Errorf("invalid expression")
		}
	}()
	operands := stack.New()
	for _, e := range strings.Split(rpn, " ") {
		if num, err := strconv.Atoi(e); err == nil {
			operands.Push(float64(num))
		} else {
			right, left := operands.Pop().(float64), operands.Pop().(float64)
			switch e {
			case "*":
				operands.Push(left * right)
			case "/":
				operands.Push(left / right)
			case "-":
				operands.Push(left - right)
			case "+":
				operands.Push(left + right)
			}
		}
	}
	value = operands.Pop().(float64)
	return
}
