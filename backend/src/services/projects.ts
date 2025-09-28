import models from "@models/index";
import logger from "@utils/logger";
import { page } from "@utils/pagination";
import { parseRange } from "@utils/price";
import { Op, WhereOptions } from "sequelize";

export async function create_project(req_body: any) {
  try {
    if (
      req_body.price_range &&
      (!req_body.price_min_inr || !req_body.price_max_inr)
    ) {
      const { min, max } = parseRange(req_body.price_range);
      if (min && !req_body.price_min_inr) (req_body as any).price_min_inr = min;
      if (max && !req_body.price_max_inr) (req_body as any).price_max_inr = max;
    }

    const created = await models.Project.create(req_body as any);
    if (!created) {
      return { status: 400, data: { message: "Project not created" } };
    }
    return { status: 201, data: created };
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Create Project Service",
      { requestBody: req_body }
    );
    return { status: 500, data: { message: "Internal Server Error" } };
  }
}

export async function get_projects(req_query: any) {
  try {
    const { limit, offset } = page(req_query.limit, req_query.offset);

    // build filters
    const where: WhereOptions = {};
    if (req_query.location)
      where["location"] = { [Op.iLike]: `%${req_query.location}%` };
    if (req_query.status) where["status"] = req_query.status;

    const include = [
      {
        model: models.Builder,
        attributes: ["id", "name", "hq_location", "established_year"],
        where: req_query.builder_name
          ? { name: { [Op.iLike]: `%${req_query.builder_name}%` } }
          : undefined,
        required: req_query.builder_name ? true : false,
      },
    ];

    // sorting
    const order: any[] = [];
    if (req_query.sort_by === "price_min")
      order.push(["price_min_inr", req_query.sort_order]);
    if (req_query.sort_by === "established_year")
      order.push([models.Builder, "established_year", req_query.sort_order]);
    order.push(["id", "asc"]); // deterministic tiebreaker

    const { rows, count } = await models.Project.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order,
    });
    return { status: 200, data: { total: count, limit, offset, data: rows } };
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Get Projects Service",
      { requestQuery: req_query }
    );
    return { status: 500, data: { message: "Internal Server Error" } };
  }
}

export async function get_project_by_id(req_body: any) {
  try {
    const { id } = req_body;
    const project = await models.Project.findByPk(id, {
      include: [
        {
          model: models.Builder,
          attributes: ["id", "name", "hq_location", "established_year"],
        },
      ],
    });
    if (!project)
      return { status: 404, data: { message: "Project not found" } };
    return { status: 200, data: project };
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Get Project By ID Service",
      { requestBody: req_body }
    );
    return { status: 500, data: { message: "Internal Server Error" } };
  }
}
