import { Router } from "express";
import {
  create_project_schema,
  list_projects_query_schema,
} from "@validators/projects";
import {
  create_project,
  get_project_by_id,
  get_projects,
} from "@services/projects";

const router = Router();

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Private
 * @body (number, required)
 * - name (string, required)
 * - location (string, required)
 * - price_range (string, optional, e.g., "50-100 Lakhs")
 * - price_min_inr (number, optional, in INR)
 * - price_max_inr (number, optional, in INR)
 * - status (string, one of 'Ongoing', 'Ready to Move', 'Completed', 'Paused'; default 'Ongoing')
 */

router.post("/", async (req, res, next) => {
  try {
    const payload = create_project_schema.parse(req.body);
    const { status, data: created } = await create_project(payload);
    if (status !== 201) return res.status(status).json(created);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({
      message: "Invalid request",
      error: e instanceof Error ? e.message : e,
    });
  }
});

/**
 * @route GET /api/projects
 * @desc List projects with optional filters, pagination, and sorting
 * @access Private
 * @query (all optional):
 * - limit (number, default 10)
 * - offset (number, default 0)
 * - location (string, partial match)
 * - status (string, exact match)
 * - builder_name (string, partial match on associated builder's name)
 * - sort_by (string, one of 'price_min', 'established_year'; default 'id')
 * - sort_order (string, 'asc' or 'desc'; default 'asc')
 */
router.get("/", async (req, res, next) => {
  try {
    const q = list_projects_query_schema.parse(req.query);
    const { status, data } = await get_projects(q);
    res.status(status).json(data);
  } catch (e) {
    res.status(400).json({
      message: "Invalid request",
      error: e instanceof Error ? e.message : e,
    });
  }
});

/**
 * @route GET /api/projects/:id
 * @desc Get project details by ID
 * @access Private
 * @paaram id (number)
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const { status, data } = await get_project_by_id({ id });
    res.status(status).json(data);
  } catch (e) {
    res.status(400).json({
      message: "Invalid request",
      error: e instanceof Error ? e.message : e,
    });
  }
});

export default router;
