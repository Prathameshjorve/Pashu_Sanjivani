const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { auth, requireRole } = require('../middleware/authMiddleware');

// Apply middleware to all vet routes
router.use(auth, requireRole('vet'));

// GET all reports for vet dashboard
router.get("/reports", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM reports
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching vet reports:", error);

    res.status(500).json({
      message: "Server error while fetching reports",
      error: error.message,
    });
  }
});

// GET single report by id
router.get("/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM reports
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching single report:", error);

    res.status(500).json({
      message: "Server error while fetching report",
      error: error.message,
    });
  }
});

// UPDATE vet review
router.put("/reports/:id/review", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      review_status,
      vet_diagnosis,
      vet_advice,
      vet_medicine,
      follow_up_required,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE reports
      SET 
        review_status = $1,
        vet_diagnosis = $2,
        vet_advice = $3,
        vet_medicine = $4,
        follow_up_required = $5,
        reviewed_at = NOW()
      WHERE id = $6
      RETURNING *
      `,
      [
        review_status || "reviewed",
        vet_diagnosis || "",
        vet_advice || "",
        vet_medicine || "",
        follow_up_required || false,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json({
      message: "Vet review submitted successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting vet review:", error);

    res.status(500).json({
      message: "Server error while submitting vet review",
      error: error.message,
    });
  }
});

module.exports = router;