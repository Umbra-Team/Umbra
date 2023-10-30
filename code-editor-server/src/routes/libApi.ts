import express, { Request, Response } from "express";

const router = express.Router();

// beginnings indexedDB setup (should move to middleware)
const openRequest = indexedDB.open('libStore');
let db;

openRequest.onupgradeneeded = (event) => {
  db = openRequest.result;
  switch(event.oldVersion) {
    case 0:
      // initialize
    case 1:
      // update db version
  }
};

openRequest.onerror = () => {
  console.error("Error: ", openRequest.error);
}

openRequest.onsuccess = () => {
  db = openRequest.result;
}

// routes
router.get('/snippets', (req, res) => {

})

router.get('/snippets/:id', (req, res) => {

})

router.post('/snippets', (req, res) => {

})

router.patch('/snippets/:id', (req, res) => {

})

router.delete('/snippets/:id', (req, res) => {

})