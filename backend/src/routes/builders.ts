import { Router } from "express";
import { create_builder } from "@services/builder";
import { create_builder_schema } from "@validators/builders";

const router = Router();

/**
 * @route   POST /api/builders
 * @desc    Create a new builder
 * @access  Private
 * @body    { hq_location: string, name: string, established_year: number }
 */
router.post("/", async (req, res, next) => {
  try {
    const payload = create_builder_schema.parse(req.body);
    const result = await create_builder(payload);
    res.status(result.status).json(result);
  } catch (e) {
    res.status(400).json({
      message: "Invalid request",
      error: e instanceof Error ? e.message : e,
    });
  }
});

export default router;
