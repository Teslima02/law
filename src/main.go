package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Article struct {
	Id      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

var Articles []Article

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Homepage endpoint")
}

func allArticles(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == "GET" {
		w.Header().Set("Access-Control-Allow-Headers", "Authorization") // You can add more headers here if needed
	}
	//  else {
	// Your code goes here
	// }

	fmt.Println("Endpoint: All article endpoint")
	json.NewEncoder(w).Encode(Articles)
}

func oneArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	// fmt.Fprint(w, "key: "+key)

	// Loop over all of our Articles
	// if the article.Id equals the key we pass in
	// return the article encoded as JSON

	for _, article := range Articles {
		if article.Id == key {
			json.NewEncoder(w).Encode(article)
		}
	}
}

func createNewArticle(w http.ResponseWriter, r *http.Request) {
	// get the body of our POST request
	// unmarshal this into a new Article struct
	// append this to our Articles array.

	reqBody, _ := ioutil.ReadAll(r.Body)
	var article Article
	json.Unmarshal(reqBody, &article)

	// update our global Articles array to include
	// our new Article
	Articles = append(Articles, article)
	json.NewEncoder(w).Encode(article)
	// fmt.Fprintf(w, "%+v", string(reqBody))
}

func updateArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	fmt.Fprint(w, "key: "+key)
}

func deleteArticle(w http.ResponseWriter, r *http.Request) {
	// once again, we will need to parse the path parameters
	vars := mux.Vars(r)

	// we will need to extract the `id` of the article we
	// wish to delete

	id := vars["id"]

	// we then need to loop through all our articles
	for index, article := range Articles {
		// if our id path parameter matches one of our
		// articles
		if article.Id == id {
			// updates our Articles array to remove the
			// article
			Articles = append(Articles[:index], Articles[index+1:]...)
		}
	}
}

func handleRequests() {
	// creates a new instance of a mux router
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/articles", allArticles)
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	myRouter.HandleFunc("/article/{id}", oneArticle)
	myRouter.HandleFunc("/article/update/{id}", updateArticle).Methods("PUT")
	myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
	log.Fatal(http.ListenAndServe(":8081", myRouter))
}

func main() {

	Articles = []Article{
		Article{Id: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		Article{Id: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}

	// fmt.Println("Go MySQL Tutorial")

	// // Open up our database connection.
	// // I've set up a database on my local machine using phpmyadmin.
	// // The database is called testDb
	// db, err := sql.Open("mysql", "root:Teslim123@tcp(127.0.0.1:3306)/testDB")

	// // if there is an error opening the connection, handle it
	// if err != nil {
	// 	panic(err.Error())
	// }

	// // defer the close till after the main function has finished
	// // executing
	// defer db.Close()

	// // perform a db.Query insert
	// insert, err := db.Query("INSERT INTO test VALUES (2, 'Test')")

	// if err != nil {
	// 	panic(err.Error())
	// }

	// // be careful deferring Queries if you are using transactions
	// defer insert.Close()

	handleRequests()
}