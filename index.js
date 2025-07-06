const express = require("express")
const mongoose = require("mongoose")
const app = express()
const { initializeDatabase } = require("./db/db.connect");
const Job = require("./jobSchema")
const serverless = require("serverless-http");

app.use(express.json());

initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.get("/jobs", async (req, res) => {
  try {
    const search = req.query.search || "";
    const jobs = await Job.find({
      title: { $regex: search, $options: "i" },
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});


app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Error fetching job" });
  }
});


app.post("/jobs", async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: "Invalid job data", details: err.message });
  }
});


app.delete("/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting job" });
  }
});

module.exports.handler = serverless(app);
