package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os/exec"
	"strconv"
	"strings"
)

func main() {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202010055")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])

	r := csv.NewReader(strings.NewReader(output))

	// for {
	// 	record, err := r.Read()
	// 	if err == io.EOF {
	// 		break
	// 	}
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	user, err := user.LookupId(record[1])
	// 	if err != nil {
	// 		log.Fatalf(err.Error())
	// 	}
	// 	record[1] = user.Username
	// 	fmt.Println(record)
	// }

	cmd = exec.Command("sh", "-c", "cat /proc/ram_202010055")
	out, err = cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output = string(out[:])
	r = csv.NewReader(strings.NewReader(output))
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		megabyte := 1024 * 1024
		total_mem, err := strconv.ParseFloat(record[0], 64)
		total_mem = total_mem / float64(megabyte)

		free_mem, err := strconv.ParseFloat(record[1], 64)
		free_mem = free_mem / float64(megabyte)

		fmt.Printf("Total: %f, Free: %f\n", total_mem, free_mem)
	}

}
