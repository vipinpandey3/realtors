import models from "@models/index";
import logger from "@utils/logger";

export async function create_builder(req_body: any) {
  try {
    const { hq_location, name, established_year } = req_body;
    const builder = await models.Builder.create({
      name,
      hq_location,
      established_year,
    });
    if (builder) {
      logger.info("Builder created successfully", { builder });
      return { status: 201, data: builder };
    } else {
      return { status: 400, data: { message: "Builder not created" } };
    }
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Create Builder Service",
      { requestBody: req_body }
    );
    return { status: 500, data: { message: "Internal Server Error" } };
  }
}
