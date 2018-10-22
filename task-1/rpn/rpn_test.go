package rpn

import "testing"

func TestFromInfixNotation(t *testing.T) {
	cases := []struct {
		in, want string
	}{
		{"2+2", "2 2 +"},
		{"2+(-2)", "2 -2 +"},
		{"22+(-2)*3-4", "22 -2 3 * + 4 -"},
	}
	for _, c := range cases {
		got, _ := FromInfixNotation(c.in)
		if got != c.want {
			t.Errorf("FromInfixNotation(%q) == %q, want %q", c.in, got, c.want)
		}
	}
}

func TestErrorFromInfixNotation(t *testing.T) {
	cases := []string{
		"abc",
		"3-3)",
	}
	for _, c := range cases {
		_, err := FromInfixNotation(c)
		if err == nil {
			t.Errorf("FromInfixNotation(%q) doesn't throw an error", c)
		}
	}
}

func TestEval(t *testing.T) {
	cases := []struct {
		in   string
		want float64
	}{
		{"2+2", 4},
		{"2+(-2)", 0},
		{"22+(-2)*3-4", 12},
		{"-3", -3},
		{"3/2", 1.5},
		{"123-123-123-(-123)", 0},
	}
	for _, c := range cases {
		inf, _ := FromInfixNotation(c.in)
		got, _ := Calculate(inf)
		if got != c.want {
			t.Errorf("Calculate(FromInfixNotation(%q)) == %f, want %f", c.in, got, c.want)
		}
	}
}

func TestErrorEval(t *testing.T) {
	cases := []string{
		"4//4",
		"90/-2",
	}
	for _, c := range cases {
		inf, _ := FromInfixNotation(c)
		_, err := Calculate(inf)
		if err == nil {
			t.Errorf("Calculate(FromInfixNotation(%q)) doesn't throw an error", c)
		}
	}
}
