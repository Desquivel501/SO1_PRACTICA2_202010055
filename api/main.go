package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os/exec"
	"os/user"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

func main() {

	db, err := sql.Open("mysql", "root:password@tcp(34.121.112.46:3306)/TASK_MANAGER")
	defer db.Close()

	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("DELETE FROM PROCESSES")
	if err != nil {
		panic(err)
	}

	idle := 0
	total := 0

	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202010055")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])

	r := csv.NewReader(strings.NewReader(output))

	sqlStr := "INSERT INTO PROCESSES(PID, USERNAME, PROCESS_NAME, STATE, PARENT, RAM) VALUES"
	vals := []interface{}{}

	RUNNING := 0
	SUSPENDED := 0
	STOPPED := 0
	ZOMBIE := 0
	TOTAL_P := 0

	i := 0

	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		if i == 0 {
			i = 1
			idle, err = strconv.Atoi(record[0])
			total, err = strconv.Atoi(record[1])
			// usage = (1 - (idle / total)) * 100
			continue
		}

		user, err := user.LookupId(record[1])
		if err != nil {
			record[1] = "NULL"
		} else {
			record[1] = user.Username
		}

		fmt.Println(record)

		PID, err := strconv.Atoi(record[0])
		STATE, err := strconv.Atoi(record[3])
		PARENT, err := strconv.Atoi(record[4])
		RAM, err := strconv.Atoi(record[5])

		sqlStr += "(?, ?, ?, ?, ?, ?),"
		vals = append(vals, PID, record[1], record[2], STATE, PARENT, RAM)

		if STATE == 0 {
			RUNNING += 1
		} else if STATE == 4 {
			ZOMBIE += 1
		} else if STATE == 8 {
			STOPPED += 1
		} else {
			SUSPENDED += 1
		}
	}

	TOTAL_P = RUNNING + ZOMBIE + STOPPED + SUSPENDED

	usage_cpu := (1 - (float64(idle) / float64(total))) * 100

	fmt.Printf("CPU Usage: %f%%\n", usage_cpu)

	sqlStr = sqlStr[0 : len(sqlStr)-1]
	stmt, _ := db.Prepare(sqlStr)
	stmt.Exec(vals...)

	fmt.Println("------------------------------------------------")

	usage_ram := 0.0

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
			fmt.Println("Here")
			log.Fatal(err)
		}

		buffer_mem, err := strconv.ParseFloat(record[0], 64)
		free_mem, err := strconv.ParseFloat(record[1], 64)
		total_mem, err := strconv.ParseFloat(record[2], 64)
		mem_unir, err := strconv.ParseFloat(record[3], 64)

		buffer_mem = (buffer_mem * mem_unir) / (1024 * 1024)
		total_mem = (total_mem * mem_unir) / (1024 * 1024)
		free_mem = (free_mem * mem_unir) / (1024 * 1024)

		usage_ram = (total_mem - (free_mem + buffer_mem)) / total_mem

		fmt.Printf("Total: %f, Free: %f, Buffer: %f\n", total_mem, free_mem, buffer_mem)
		fmt.Printf("Usado: %f%%\n", usage_ram*100)
	}

	usage_ram = usage_ram * 100

	sql := fmt.Sprintf("INSERT INTO MONITOR(CPU_FREE, RAM_FREE, RUNNING, SUSPENDED, STOPPED, ZOMBIE, TOTAL) VALUES (%f, %f, %d, %d, %d, %d, %d)", 100-usage_cpu, 100-usage_ram, RUNNING, SUSPENDED, STOPPED, ZOMBIE, TOTAL_P)
	_, err = db.Exec(sql)
	if err != nil {
		panic(err.Error())
	}
}
